import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor() { }

  ngOnInit() {
    this.showChart();
  }

  showChart(){
    var ctx = (<any>document.getElementById('yudhatp-chart')).getContext('2d');
    var chart = new Chart(ctx, {
      type: 'pie', 
      data: {
        labels: ["SO2", "CO2", "NOX"],
        datasets: [{
          label: "This is chart",
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 163, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 163, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          data: [20, 5, 10],
          borderWidth:1
        }]
      }
    })
  }

}
