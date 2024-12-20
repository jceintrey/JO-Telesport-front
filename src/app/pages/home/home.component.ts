
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';


import { Participation } from 'src/app/core/models/Participation';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  
 

  constructor(private olympicService: OlympicService, private router: Router) {

  
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
   * Gère l'évènement de clicc sur une part du PieChart
   * @param data données
   * @returns void
   */
  onSelect(data: { name: string; value: number }): void {

    if (!data) {
      console.warn('Aucune donnée reçue lors du clic.');
      return;
    }

    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    console.log(data.name+" "+data.value);
    this.router.navigate(['details'], { queryParams: { name: data.name, value: data.value } });

  }
  /**
   * Gère l'évènement survol sur une part du PieChart
   * @param data données
   * @returns void
   */
  onActivate(data: { name: string; value: number }): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  /**
   * Gère l'évènement fin du survol sur une part du PieChart
   * @param data données
   * @returns void
   */
  onDeactivate(data: { name: string; value: number }): void {
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
