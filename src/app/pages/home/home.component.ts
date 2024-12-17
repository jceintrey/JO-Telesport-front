
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

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

  public pieChartData: ChartData<'pie'> ={
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#9780A1',
          '#89A1DB',
          '#793D52',
          '#956065',
          '#B8CBE7',
          '#BFE0F1',
        ], // Exemple de couleurs pour les segments
        hoverBackgroundColor: ['#04838F', '#6FF34F', '#4F6BFF', '#E0E0E0'],
        borderWidth: 0,
      },
    ],
  }
   

 

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    // Manipulation des données pour le graphique
    this.olympics$.subscribe((olympics) => {
      const medalCountByCountry = this.calculateMedalCounts(olympics);
      this.pieChartData.labels = Object.keys(medalCountByCountry);
      this.pieChartData.datasets[0].data = Object.values(medalCountByCountry);
      

      // Nombre de pays distincts
      this.countriesCount = this.calculateCountryCounts(olympics);
      console.log('Nombre de pays:', this.countriesCount);

      // Nombre de JO distincts
      this.joCount = this.calculateJoCounts(olympics);
      console.log('Nombre de JO:', this.joCount);
    });
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
