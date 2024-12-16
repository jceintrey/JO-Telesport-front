/*
* Représente l'histoire des jeux olympiques pour un Pays
* Inclu l'id unique, le nom du pays et la liste des participations du pays aux jeux
*/

import { Participation } from "./Participation";


export interface Olympic {
    id: number;
    country: string;
    participations: Participation [];
  }