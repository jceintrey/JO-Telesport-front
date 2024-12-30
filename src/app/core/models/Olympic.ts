
import { Participation } from "./Participation";

/**
* Représente l'histoire des jeux olympiques d'un pays.  
* 
* Inclu l'id unique, le nom du pays et la liste de ses participations aux jeux
*/

export interface Olympic {
    /**
     * id unique de la donnée olympique d'un pays
     */
    id: number;
    /**
     * Nom du pays
     */
    country: string;
    /**
     * Tableau des participations du pays
     */
    participations: Participation [];
  }