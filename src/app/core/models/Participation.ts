
/**
 * Enumération des valeurs d'années valides
 */
type Year =
  | 1896 | 1900 | 1904 | 1908 | 1912 | 1920 | 1924
  | 1928 | 1932 | 1936 | 1948 | 1952 | 1956 | 1960
  | 1964 | 1968 | 1972 | 1976 | 1980 | 1984 | 1988
  | 1992 | 1996 | 2000 | 2004 | 2008 | 2012 | 2016
  | 2020 | 2024;

/**
* Représente une participation d'un pays aux jeux olympique
* Inclu l'id unique, l'année que l'on restreint avec un type, la ville hôte, le nombre de médailles totales et le nombres d'athlètes du pays auquel la participation appartient
*/

export interface Participation {
  /**
   * Identifiant unique d'une participation d'un pays 
   */
    id: number;
    /**
     * Année de participation
     */
    year: Year;
    /**
     * Nom de la ville d'accueil
     */
    city: string;
    /**
     * Nombre de médailles pour cette participation pour le pays
     */
    medalsCount: number;
    /**
     * Nombre d'athlète pour cette participation pour le pays
     */
    athleteCount: number;
  }