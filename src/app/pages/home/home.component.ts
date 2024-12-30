import { Observable, Subscription } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { NGXLogger } from 'ngx-logger';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PieGraphData } from 'src/app/core/models/PieGraphData';

/**
 * Composant d'accueil de l'application.
 * Ce composant affiche un aperçu des données olympiques, y compris le nombre de pays
 * participants et le nombre total de Jeux Olympiques enregistrés.
 *
 * - Utilise le service `OlympicService` pour récupérer les données.
 * - Gère les graphiques via `ngx-charts`.
 *
 * @component
 * @implements OnInit
 * @implements OnDestroy
 */
@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  /**
   * Observable représentant les données des Jeux Olympiques.
   *
   * @public
   * @type {Observable<Olympic[]>}
   */
  public olympics$: Observable<Olympic[]> = new Observable<Olympic[]>();

  /**
   * Subscription représentant l'abonnement au service
   *
   * @public
   * @type {Subscription}
   */
  private subscription: Subscription = new Subscription();

  /**
   * Compteur de nombre de pays participants
   */
  public countriesCount: number = 0;

  /**
   * Compteur de nombre de jeux
   */
  public joCount: number = 0;
 
  /**
   * Données utilisées pour générer un graphique de type Pie
   *
   * @type {pieChartData[]}
   */
  public pieChartData: { name: string; value: number }[] = [];
  /**
   * Schéma des couleurs pour le graph
   */
  public colorScheme: any;

  constructor(
    private olympicService: OlympicService,
    private router: Router,
    private logger: NGXLogger
  ) {}

  /**
   * Initialise les données du composant
   *
   * - Récupère les données olympiques sous forme d'un Observable via le service OlympicService.
   * - Configure les couleurs pour le graphique en camembert.
   * - Prépare les données pour construire le graphique.
   * - Calcule les chiffres clés affichés dans les cartes.
   *
   */
  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    //Schéma manuel de couleurs pour le graph
    this.colorScheme = {
      domain: [
        '#793D52',
        '#89A1DB',
        '#956065',
        '#B8CBE7',
        '#BFE0F1',
        '#9780A1',
      ],
    };

    // Construction des différentes données à afficher à partir des data de l'observable
    this.subscription = this.olympics$.subscribe((olympics) => {
      //construction des données pour le graphique
      this.pieChartData = this.buildData(olympics);

      // Nombre de pays distincts
      this.countriesCount =
        this.olympicService.calculateCountryCounts(olympics);
      console.log('Nombre de pays:', this.countriesCount);

      // Nombre de JO distincts
      this.joCount = this.olympicService.calculateJoCounts(olympics);
      console.log('Nombre de JO:', this.joCount);
    });
  }

  /**
   * Termine proprement lors de la destruction du composant.
   *
   * - Désabonne l'Observable.
   */
  ngOnDestroy(): void {
    this.logger.debug('Desctruction du composant');
    this.subscription.unsubscribe();
  }

  /**
   * Construit un tableau de PieGraphData
   *
   * - Construit les données attendues par PieGraph
   * @param olympics Liste des données olympiques
   * @returns PieGraphData[]
   */
  private buildData(olympics: Olympic[]): PieGraphData[] {
    const medalCountByCountry =
      this.olympicService.calculateTotalMedalCounts(olympics);

    return Object.keys(medalCountByCountry).map((country) => {
      return {
        name: country,
        value: medalCountByCountry[country],
      };
    });
  }

  /**
   * Gère l'évènement de clic sur une part du PieChart
   *
   * - redirige vers la page details du pays cliqué
   *
   * @param data données
   * @returns void
   */
  onSelect(data: { name: string; value: number }): void {
    if (!data) {
      this.logger.warn('Aucune donnée reçue lors du clic.');
      return;
    }

    this.logger.debug('Item clicked: ' + data.name + ' ' + data.value);

    try {
      this.router.navigate(['details'], {
        queryParams: { countryName: data.name },
      });
    } catch (error) {
      this.logger.error('Erreur lors de la navigation :', error);
    }
  }
  /**
   * Gère l'évènement survol sur une part du PieChart
   *
   * - méthode non utilisée et préparée pour une utilisation future
   * @ignore
   * @param data données
   * @returns void
   */
  onActivate(data: { name: string; value: number }): void {
    this.logger.debug('Activate', JSON.parse(JSON.stringify(data)));
  }

  /**
   * Gère l'évènement fin de survol sur une part du PieChart
   *
   * - méthode non utilisée et préparée pour une utilisation future
   * @ignore
   * @param data données
   * @returns void
   */
  onDeactivate(data: { name: string; value: number }): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
