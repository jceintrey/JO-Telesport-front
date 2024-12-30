/**
* Représente les données pour construire le graphique de type LineGraph.  
* 
* La structure de donnée utilisée pour Linegraph est documentée [ici](https://swimlane.gitbook.io/ngx-charts/examples/line-area-charts/line-chart#regular-line-charts)
*/

export interface LineGraphData {
  /**
   * nom de référence de la ligne graphique
   */
  name: string;
  /**
   * Représente une série du graphique
   */
  series: {name: string, value:number}[];
}