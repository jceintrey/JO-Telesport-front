/*
* Représente les données pour linegraph
*/


export interface LineGraphData {
  name: string;
  series: {name: string, value:number}[];
}