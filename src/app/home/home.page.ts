import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ReceptorBLE } from "../core/services/receptorBLE.service";
import { Platform } from "@ionic/angular";


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private ble: ReceptorBLE,
    public plt: Platform
  ) { 
    if (plt.is('android')) {
      this.ble.inizializar();
    }
  }

  ngOnInit() {
    this.showChart();
  }

  showChart() {
    let ctx = (<any>document.getElementById('yudhatp-chart')).getContext('2d');

    let data = {
      datasets: [{
        data: [
          20,
          5,
          10
        ],
        backgroundColor: [
          "#FF6384",
          "#4BC0C0",
          "#FFCE56"
        ]
      }],
      labels: [
        "SO2",
        "CO2",
        "NOX"
      ]
    };

    let chart = new Chart(ctx, {
      data: data,
      type: 'doughnut'
    });
  }

}
