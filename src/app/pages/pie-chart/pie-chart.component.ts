
import { Component } from '@angular/core';


  
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
  
@Component({
  selector: 'app-pie-chart',
  standalone: false,
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent {
  
  title = 'ng2-charts-demo';
  
  public lineChartData: ChartConfiguration['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
  
    datasets: [
      {
        data: [ 40, 45, 50, 55, 60, 65, 70, 75, 70, 60, 50, 45 ],
        label: 'Angular',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)'
      },
      {
        data: [ 45, 50, 60, 70, 75, 65, 50, 60, 55, 50, 45, 45 ],
        label: 'React',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(0,255,0,0.3)'
      }
    ]
  };

  public lineChartOptions: ChartOptions = {
    responsive: false
  };
  
  public lineChartLegend = true;
    
}
