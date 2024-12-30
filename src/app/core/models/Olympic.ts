/*
* Représente l'histoire des jeux olympiques d'un pays
* Inclu l'id unique, le nom du pays et la liste de ses participations aux jeux
*/

import { Participation } from "./Participation";


export interface Olympic {
    id: number;
    country: string;
    participations: Participation [];
  }