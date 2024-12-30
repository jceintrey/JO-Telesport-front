import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { NGXLogger } from 'ngx-logger';
import { LineGraphData } from 'src/app/core/models/LineGraphData';

@Component({
  selector: 'app-details',
  standalone: false,
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
  
})

/**
 * Composant de page détail de l'application.
 * Ce composant affiche les données Olympiques d'un pays en particulier
 *
 * - Utilise le service OlympicService pour récupérer les données.
 * - Est appelé par passage du paramètre countryName en GET.
 * - Gère les graphiques via ngx-charts.
 *
 * @component
 * @implements OnInit
 * @implements OnDestroy
 */
export class DetailsComponent implements OnInit, OnDestroy {

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
   * flag qui permet de savoir si le pays sélectionné est dans les données
   *
   * @type {boolean}
   */
  public countryNotFound: boolean = false;
  /**
   * Données utilisées pour générer un graphique en ligne
   *
   * @type {LineGraphData[]}
   */
  public data!: LineGraphData[];

  //Autres propriétés utilisées dans le template

  /**
   * Schéma des couleurs pour le graph
   */
  public colorScheme: any;
  
  /**
   * Pays sélectionné 
   */
  public country!: string;
  /**
   * Compteur d'entrées = nombre de participations
   */
  public numberOfEntries!: number;
/**
   * Compteur de médailles
   */
  public numberOfMedals!: number;
  /**
   * Compteur d'atlètes'
   */
  public numberOfAthletes!: number;

  /**
   * Constructeur du composant avec injection des services nécessaires
   *
   * @param {Router} router - Service pour effectuer le routage dans l'application
   * @param {ActivatedRoute} route - Service pour récupérer la route active
   * @param {OlympicService} olympicService - Service pour accéder aux données de l'application
   * @param {NGXLogger} logger - Service pour journaliser
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private logger: NGXLogger
  ) {}

  /**
   * Initialise les données du composant
   *
   * - Récupère les données olympiques sous forme d'un Observable via le service OlympicService.
   * - Configure les couleurs pour le graphique en ligne.
   * - Récupère et vérifie le paramètre countryName
   * - Prépare les données pour construire le graphique.
   * - Calcule les chiffres clés affichés dans les cartes.
   *
   */
  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    //Schéma manuel de couleurs pour le graph
    this.colorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C'],
    };

    //Récupération du paramètre countryName passé
    this.route.queryParams.subscribe((params) => {
      this.country = params['countryName'];

      //validation du paramètre
      const countryNameRegex = /^[A-Za-z\-]+$/;
      if (!this.country || !countryNameRegex.test(this.country)) {
        this.logger.error(
          `Le paramètre countryName ${this.country} n'est pas conforme`
        );
        this.countryNotFound = true;
        return;
      }
    });

    // Construction des différentes données à afficher à partir des data de l'observable
    this.subscription = this.olympics$.subscribe((olympic) => {
      // On verifie si le country existe
      if (!this.olympicService.countryExist(olympic, this.country)) {
        this.logger.error(`Le pays demandé \'${this.country}\' n'existe pas`);
        this.countryNotFound = true;
        return;
      }

      this.countryNotFound = false;

      // construction du tableau de données pour le linegraph
      this.data = this.buildData(olympic, this.country);
      this.logger.debug('Data: ' + this.data);

      // calcul des compteurs du nombre de participations, de médailles et d'athlètes pour le pays
      this.numberOfEntries = this.olympicService.calculateCountsForCountry(
        olympic,
        this.country,
        'participations'
      );
      this.numberOfMedals = this.olympicService.calculateCountsForCountry(
        olympic,
        this.country,
        'medals'
      );
      this.numberOfAthletes = this.olympicService.calculateCountsForCountry(
        olympic,
        this.country,
        'athletes'
      );
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
   * Construit un tableau de LineGraphData
   *
   * - Construit les données attendues par liengraph de ngx-charts
   *
   * @param olympics Liste des données olympiques
   * @param country le pays
   * @returns LineGraphData[]
   */

  private buildData(olympics: Olympic[], country: string): LineGraphData[] {
    const countryData = olympics.find((olympic) => olympic.country === country);

    if (!countryData) {
      this.logger.warn(`Données pour le pays "${country}" non trouvées.`);
      return [];
    }

    const graphItem: LineGraphData = {
      name: country,
      series: countryData.participations.map((participation) => ({
        name: participation.year.toString(),
        value: participation.medalsCount,
      })),
    };

    return [graphItem]; // Retourne un tableau avec ici un seul objet (serie) pour le pays
  }
}
