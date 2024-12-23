/*
* Représente l'histoire des jeux olympiques ou autrement dit les données Olympique d'un Pays
* Inclu l'id unique, le nom du pays et la liste des participations du pays aux jeux
*/





export interface Serie {
  name: string;
  value: number;
}

export interface GraphData {
  name: string;
  series: Serie[];
}