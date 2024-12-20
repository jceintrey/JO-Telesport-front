import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private olympicService: OlympicService
  ) {
    this.olympics$ = olympicService.getOlympics();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.name = params['name'];
      this.value = +params['value']; // Conversion en number
    });
    this.olympics$.subscribe((olympic) => {
      //this.toConsole(olympic);
      this.calculateMedalCountsForCountry(olympic,this.name);
      this.calculateAthleteCountsForCountry(olympic,this.name);

    });
  }


  /**
   * Calcule le total des médailles remportées pour un pays donné
   * @param olympics Liste des données olympiques, le pays
   * @returns number le nombre total de médailles
   */

  private calculateMedalCountsForCountry(olympics: Olympic[], country: string): number {
   // recherche des données olympiques du pays
    const countryData = olympics.find((olympic)=>(olympic.country == country));

     // initialisation du compteur
   let  totalMedals = 0;

    if (!countryData){
      console.log(`Pays ${country} non trouvé`);
      
    }
    else {
      countryData.participations.forEach((participation) => {
        console.log(`${participation.city} | ${participation.year}`);
        totalMedals+=participation.medalsCount;
      });
    
    console.log("Nombre total de médailles: " + totalMedals);

    }
   

   
    return totalMedals;
  }


  
  /**
   * Calcule le total d'athlètes pour un pays donné
   * @param olympics Liste des données olympiques, le pays
   * @returns number le nombre total d'athlètes
   */

  private calculateAthleteCountsForCountry(olympics: Olympic[], country: string): number {
    // recherche des données olympiques du pays
     const countryData = olympics.find((olympic)=>(olympic.country == country));
 
      // initialisation du compteur
    let  totalAthletes = 0;
 
     if (!countryData){
       console.log(`Pays ${country} non trouvé`);
       
     }
     else {
       countryData.participations.forEach((participation) => {
         console.log(`${participation.city} | ${participation.year}`);
         totalAthletes+=participation.athleteCount;
       });
     
     console.log("Nombre total d'athletes: " + totalAthletes);
 
     }
    
 
    
     return totalAthletes;
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
