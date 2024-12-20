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
      this.toConsole(olympic);
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
