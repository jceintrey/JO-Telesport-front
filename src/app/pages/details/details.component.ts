import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GraphData } from 'src/app/core/models/lineGraphInterfaces';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

import { NGXLogger } from 'ngx-logger';


@Component({
  selector: 'app-details',
  standalone: false,
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent {
  public olympics$: Observable<Olympic[]> = new Observable<Olympic[]>();
  name!: string;
  value!: number;
  numberOfEntries !: number;
  numberOfMedals !: number;
  numberOfAthletes !: number;


  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C']
  };

  public data!: {};
  public data2!: {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private logger: NGXLogger

  ) {
    this.olympics$ = olympicService.getOlympics();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.name = params['name'];
      this.value = +params['value']; // Conversion en number
    });


    
    this.data2 = [
      {
        "name": "green",
        "series": [
          {
            "name": "Aug",
            "value": 14
          },
          {
            "name": "Sep",
            "value": 35
          },
          {
            "name": "Oct",
            "value": 4
          },
          {
            "name": "Nov",
            "value": 17
          },
          {
            "name": "Dec",
            "value": 14
          },
          {
            "name": "Jan",
            "value": 35
          }
        ]
      },
    
      {
        "name": "yellow",
        "series": [
          {
            "name": "Aug",
            "value": 364
          },
          {
            "name": "Sep",
            "value": 412
          },
          {
            "name": "Oct",
            "value": 437
          },
          {
            "name": "Nov",
            "value": 437
          },
          {
            "name": "Dec",
            "value": 364
          },
          {
            "name": "Jan",
            "value": 412
          }
        ]
      },
      {
        "name": "red",
        "series": [
          {
            "name": "Aug",
            "value": 168
          },
          {
            "name": "Sep",
            "value": 343
          },
          {
            "name": "Oct",
            "value": 512
          },
          {
            "name": "Nov",
            "value": 291
          },
          {
            "name": "Dec",
            "value": 168
          },
          {
            "name": "Jan",
            "value": 343
          },
        ]
      }
    ];
    

    this.olympics$.subscribe((olympic) => {
      //this.toConsole(olympic);
      this.data = [
        {
          name: "France",
          series: [
            { name: "2012", value: 35 },
            { name: "2016", value: 45 },
            { name: "2020", value: 33 }
          ]
        }
      ]
      this.data = this.buildData(olympic,this.name);


      this.logger.debug("data:..");
      this.logger.debug(this.data);

      this.logger.debug("data2:..");
      this.logger.debug(this.data2);
      // calcul des compteurs du nombre de participations, de médailles et d'athlètes pour le pays
      this.numberOfEntries = this.calculateCountsForCountry(olympic,this.name,"participations");
      this.numberOfMedals = this.calculateCountsForCountry(olympic,this.name,"medals");
      this.numberOfAthletes = this.calculateCountsForCountry(olympic,this.name,"athletes");
      
    });
  }

  private buildData(olympics: Olympic[], country: string): GraphData[] {
    const countryData = olympics.find((olympic) => olympic.country === country);
  
    if (!countryData) {
      this.logger.warn(`Données pour le pays "${country}" non trouvées.`);
      return [];
    }
  
    const graphItem: GraphData = {
      name: country, // Nom du pays
      series: countryData.participations.map((participation) => ({
        name: participation.year.toString(), // Convertir l'année en string
        value: participation.medalsCount // Nombre de médailles
      }))
    };
  
    return [graphItem]; // Retourne un tableau avec un seul objet pour le pays
  }
  
    




     /**
   * Calcule le total d'athlètes ou médailles ou participations pour un pays donné
   * La fonction est factorisée car le code pour retourner le nombre de médailles, ou d'athlètes et simmilaire
   * Le calcul du nombre de participation est écrit de cette façon au lieu d'un size sur le tableau pour rester dans la même logique
   * @param olympics Liste des données olympiques
   * @param country le pays
   * @param type le type de total
   * @returns number le nombre total
   */

  private calculateCountsForCountry(olympics: Olympic[], country: string, type: "athletes" | "medals" | "participations"): number {
    // recherche des données olympiques du pays
     const countryData = olympics.find((olympic)=>(olympic.country == country));
 
      // initialisation du compteur
    let  total = 0;
 
     if (!countryData){
       console.log(`Pays ${country} non trouvé`);
       
     }
     else {
      
      // itération sur les participations du pays
       countryData.participations.forEach((participation) => {

        // calcul du total en fonction du type
        switch(type){
          case 'athletes':
            total+=participation.athleteCount;
            break;
            case 'medals':
            total+=participation.medalsCount;
            break;
            case 'participations':
              total++;
              break;
        }
         
       });
     
     console.log(`Nombre total de ${type} est ${total}`);
 
     }
    
 
    
     return total;
   }

  toConsole(olympics: Olympic[]): void {
    olympics.forEach((olympic) => {
      console.log(
        'Id:' +
          olympic.id +
          ' Pays: ' +
          olympic.country +
          ' Participations:' +
          olympic.participations.forEach((participation) => {
            console.log(participation.city);
          })
      );
    });
  }
}
