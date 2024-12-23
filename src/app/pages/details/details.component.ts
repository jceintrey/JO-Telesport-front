import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

import { NGXLogger } from 'ngx-logger';
import { LineGraphData } from 'src/app/core/models/lineGraphData';


@Component({
  selector: 'app-details',
  standalone: false,
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit, OnDestroy {

  public olympics$: Observable<Olympic[]> = new Observable<Olympic[]>();
  private subscription: Subscription = new Subscription();


  country!: string;
  numberOfEntries !: number;
  numberOfMedals !: number;
  numberOfAthletes !: number;
  countryNotFound: boolean = false;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C']
  };

  public data!: LineGraphData[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private logger: NGXLogger

  ) {}


  /*
  * Code d'execution à l'initialisation du composant
  */
  ngOnInit(): void {

    this.olympics$ = this.olympicService.getOlympics();

    /*
    Récupération du paramètre passé
    */
    this.route.queryParams.subscribe((params) => {
      this.country = params['countryName'];
    });

    /*
    Souscription: abonnement à l'observable Olympics et construction des données graphiques
    */
    this.subscription = this.olympics$.subscribe((olympic) => {
     
      // On verifie si le country existe
      if (!this.olympicService.countryExist(olympic,this.country)){
        this.logger.error(`Le pays demandé \'${this.country}\' n'existe pas`);
        this.countryNotFound = true; 
        return;
      }

      this.countryNotFound = false;

      // construction du tableau de données pour le linegraph
      this.data = this.buildData(olympic,this.country);
      this.logger.debug("Data: " + this.data);

      // calcul des compteurs du nombre de participations, de médailles et d'athlètes pour le pays
      this.numberOfEntries = this.olympicService.calculateCountsForCountry(olympic,this.country,"participations");
      this.numberOfMedals = this.olympicService.calculateCountsForCountry(olympic,this.country,"medals");
      this.numberOfAthletes = this.olympicService.calculateCountsForCountry(olympic,this.country,"athletes");
      
    });
  }

/*
* Code d'execution en fin de vie du composant
*/
  ngOnDestroy(): void {
    // Désabonnement de la souscription
    this.logger.debug("Desctruction du composant");
    this.subscription.unsubscribe();
  }

  /**
   * Construit un tableau de LineGraphData
   * La fonction est utilisée pour construire les données attendues par liengraph de ngx-charts
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
      name: country, // Nom du pays
      series: countryData.participations.map((participation) => ({
        name: participation.year.toString(), // Convertir l'année en string
        value: participation.medalsCount // Nombre de médailles
      }))
    };
  
    return [graphItem]; // Retourne un tableau avec un seul objet pour le pays
  }
  
    
}
