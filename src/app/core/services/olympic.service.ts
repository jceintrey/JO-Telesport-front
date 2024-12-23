import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
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

  public calculateCountsForCountry(
    olympics: Olympic[],
    country: string,
    type: 'athletes' | 'medals' | 'participations'
  ): number {
    // recherche des données olympiques du pays
    const countryData = olympics.find((olympic) => olympic.country == country);

    // initialisation du compteur
    let total = 0;

    if (!countryData) {
      console.log(`Pays ${country} non trouvé`);
    } else {
      // itération sur les participations du pays
      countryData.participations.forEach((participation) => {
        // calcul du total en fonction du type
        switch (type) {
          case 'athletes':
            total += participation.athleteCount;
            break;
          case 'medals':
            total += participation.medalsCount;
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

  /**
   * Calcule le total des médailles remportées pour chaque pays.
   * @param olympics Liste des données olympiques.
   * @returns objet avec les pays en clé et le nombre total de médailles en valeur.
   */

  public calculateTotalMedalCounts(olympics: Olympic[]): {
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
  public calculateCountryCounts(olympics: Olympic[]): number {
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
  public calculateJoCounts(olympics: Olympic[]): number {
    const joSet = new Set<number>();
    olympics.forEach((olympic) => {
      olympic.participations.forEach((participation) => {
        joSet.add(participation.year);
      });
    });

    return joSet.size;
  }

/**
   * Vérifie si le pays existe dans les données Olympiques
   * @param olympics Liste des données olympiques.
   * @param country nom du pays
   * @returns true si le pays est dans les données olympics
   */
  public countryExist(olympics: Olympic[], country: string): boolean {
    return olympics.some((olympic) => olympic.country === country);
  }
}
