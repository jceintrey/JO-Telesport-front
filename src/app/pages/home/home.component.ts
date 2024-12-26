import { Observable, of, Subscription } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { NGXLogger } from 'ngx-logger';
import { Participation } from 'src/app/core/models/Participation';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PieGraphData } from 'src/app/core/models/PieGraphData';
import { Color, colorSets } from '@swimlane/ngx-charts';
import { formatLabel, escapeLabel } from '@swimlane/ngx-charts';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit, OnDestroy {
  public olympics$: Observable<Olympic[]> = new Observable<Olympic[]>();
  public countriesCount: number = 0;
  public joCount: number = 0;

  public pieChartData: { name: string; value: number }[] = [];
  private subscription: Subscription = new Subscription();
  colorScheme: any;
  tooltipText: string | undefined;

  constructor(
    private olympicService: OlympicService,
    private router: Router,
    private logger: NGXLogger
  ) {}

 /*
  * Code d'execution à l'initialisation du composant
  */
  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    //this.colorScheme = colorSets.find((set: { name: string; }) => set.name === '');
   
    this.colorScheme = {
      domain: ['#793D52', '#89A1DB', '#956065','#B8CBE7','#BFE0F1','#9780A1']
    };
    this.tooltipText="";
    
    // Manipulation des données pour le graphique
    this.subscription = this.olympics$.subscribe((olympics) => {
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
/*
* Code d'execution en fin de vie du composant
*/
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Construit un tableau de PieGraphData
   * La fonction est utilisée pour construire les données attendues par PieGraph de ngx-charts
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
    console.log(data.name + ' ' + data.value);
    this.router.navigate(['details'], {
      queryParams: { countryName: data.name },
    });
  }
  /**
   * Gère l'évènement survol sur une part du PieChart
   * @param data données
   * @returns void
   */
  onActivate(data: { name: string; value: number }): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
    this.tooltipText = `Pays : ${data.name}, Valeur : ${data.value}`;
  }

  /**
   * Gère l'évènement fin du survol sur une part du PieChart
   * @param data données
   * @returns void
   */
  onDeactivate(data: { name: string; value: number }): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    this.tooltipText = '';
  }



 

}
