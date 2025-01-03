import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { NGXLogger } from 'ngx-logger';

/**
 * Service pour gérer les données de Jeux Olympiques
 * Ce service charge et gère les données à partir d'un fichier json statique
 *
 *
 *
 * @example
 * //utiliser OlympicService dans un composant
 * this.olympicService.getOlympics().subscribe((olympinc) => {//utilisation de olympic:Olympic[]};
 * //charger ou recharger les données
 * this.olympicService.loadInitialData().pipe(take(1)).subscribe();
 */
@Injectable({
  providedIn: 'root', //Le service n'est instancié qu'une fois et disponible dans toute l'application
})
export class OlympicService {

  /**
  * String Url de récupération des données Olympiques
  * @private
  */
  private olympicUrl = './assets/mock/olympic.json';

/**
 * BehaviorSubject représentant les données des Jeux Olympiques.
 * 
 * - Émet un tableau contenant les informations des Jeux Olympiques.
 * - Initialisé avec un tableau vide par défaut.
 * 
 * @private
 * @type {BehaviorSubject<Olympic[]>}
 */
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

/**
 * Constructeur du service OlympicService.
 * 
 * @param {HttpClient} http - Service pour effectuer des requêtes HTTP.
 * @param {NGXLogger} logger - Service pour journaliser
 */
  constructor(private http: HttpClient, private logger: NGXLogger) {
  }

  /* Fonction permettant de charger les données à partir du fichier à l'adresse olympicUrl
   *
   * - Effectue une requète http pour récupérer les données
   * - Envoie les données dans le BehaviorSubject olympics$
   * - Retourne un observable avec tableau vide en cas d'erreur
   */
  public loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => {
        this.olympics$.next(value);
      }),

      catchError((error, caught) => {
        this.logger.error(`Erreur lors dans loadInitialData: ${error}`);
        // Mise à jour du BehaviorSubject avec un tableau vide
        this.olympics$.next([]);
        return of([]);
      })
    );
  }

  /**
  * Renvoie un observable sur les données olympiques
  * @returns un Observable contenant un tableau d'Olympic
  */
  public getOlympics(): Observable<Olympic[]> {
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
