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
    private olympicService: OlympicService,

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

      this.calculateCountsForCountry(olympic,this.name,"participations");
    });
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
