
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
// import { ChartData, ChartOptions, ChartType } from 'chart.js';
// import { Chart } from 'chart.js';
// import ChartDataLabels from 'chartjs-plugin-datalabels';

import { Participation } from 'src/app/core/models/Participation';
import { Component, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[]> = new Observable<Olympic[]>();
  public countriesCount: number = 0;
  public joCount: number = 0;

  public pieChartData: { name: string; value: number }[] = [];
  
  public view: [number, number];

 

  onResize(event: { target: { innerWidth: number; }; }) {
    console.log("largeur: " + innerWidth);
    console.log("hauteur: " + innerHeight);

    this.view = [event.target.innerWidth / 1.1, 400];
 
    if (innerWidth < 400){
      this.view = [innerWidth - 10, innerHeight -10];
    }
    console.log("view: " + this.view)
}

  constructor(private olympicService: OlympicService) {
    console.log("largeur: " + innerWidth);

console.log("hauteur: " + innerHeight);

    this.view = [innerWidth / 1.1, 400];
     
    
    console.log("view: " + this.view)
  
  }

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    
    // Manipulation des données pour le graphique
    this.olympics$.subscribe((olympics) => {
      const medalCountByCountry = this.calculateMedalCounts(olympics);

      this.pieChartData = Object.keys(medalCountByCountry).map((country) => {
        return {
          name: country,
          value: medalCountByCountry[country],
        };
      });

      

      // Nombre de pays distincts
      this.countriesCount = this.calculateCountryCounts(olympics);
      console.log('Nombre de pays:', this.countriesCount);

      // Nombre de JO distincts
      this.joCount = this.calculateJoCounts(olympics);
      console.log('Nombre de JO:', this.joCount);
    });
  }

 /**
   * Gère l'évènement de click sur une part du PieChart
   * @param data données de cliquées
   * @returns void
   */
  onSelect(data: { name: string; value: number }): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    console.log(data.name+" "+data.value);
    alert(`Vous avez sélectionné : ${data.name} avec une valeur de ${data.value}`);
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  /**
   * Calcule le total des médailles remportées pour chaque pays.
   * @param olympics Liste des données olympiques.
   * @returns objet avec les pays en clé et le nombre total de médailles en valeur.
   */

  private calculateMedalCounts(olympics: Olympic[]): {
    [country: string]: number;
  } {
    const medalCountByCountry: { [country: string]: number } = {};

    olympics.forEach((olympic) => {
      olympic.participations.forEach((participation) => {
        const country = olympic.country;
        const medals = participation.medalsCount;

        // Ajout des médailles au pays
        if (!medalCountByCountry[country]) {
          medalCountByCountry[country] = 0;
        }
        medalCountByCountry[country] += medals;
      });
    });
    
    return medalCountByCountry;
  }

  /**
   * Calcule le nombre total de pays distincts présents dans les données.
   * @param olympics Liste des données olympiques.
   * @returns Le nombre total de pays distincts.
   */
  private calculateCountryCounts(olympics: Olympic[]): number {
    const countriesSet = new Set<string>();

    olympics.forEach((olympic) => {
      countriesSet.add(olympic.country);
    });
    return countriesSet.size;
  }

  /**
   * Calcule le nombre total de Jeux Olympiques (JO) distincts.
   * @param olympics Liste des données olympiques.
   * @returns Le nombre total de JO uniques.
   */
  private calculateJoCounts(olympics: Olympic[]): number {
    const joSet = new Set<number>();
    olympics.forEach((olympic) => {
      olympic.participations.forEach((participation) => {
        joSet.add(participation.year);
      });
    });

    return joSet.size;
  }
}
