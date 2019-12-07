/*********************************************************************
@name home.page.ts
@description Lógica correspondiente a la vista "Home"
@author Joan Ciprià Moreno Teodoro
@date 10/09/2019
@license GPLv3
*********************************************************************/

import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ReceptorBLE } from '../core/services/receptorBLE.service';
import { LocalStorage } from '../core/services/localStorage.service';
import { Helper } from '../core/helper';
import { Firebase } from '../core/services/firebase.service';
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public userImg: string;

  constructor(
    private ble: ReceptorBLE,
    public plt: Platform,
    private firebase: Firebase,
    private alertCtrl: AlertController,
    private storage: LocalStorage,
    private helper: Helper

  ) {
    if (plt.is('android')) {
      this.ble.inizializar();
    }
  }

  ngOnInit() {
    this.showChart();
    this.userImg = this.helper.obtenerImagenGravatar();
    // Test Local Storage
    // this.helper.testLocalStorage();

    // ¿Es la primera vez que entra el usuirio?
    if (this.helper.EslaPrimeraVez()) {
      console.log('TLS Es la primera vez');
    } else {
      console.log('TLS No es la primera vez');
    }

  }

  showChart() {
    const ctx = (document.getElementById('yudhatp-chart') as any).getContext('2d');
    const data = {
      datasets: [{
        data: [
          0,
          0,
          0,
          60,
          40
        ],
        backgroundColor: [
          'rgb( 97, 229, 70, .8)',
          'rgb(240, 226, 10, .8)',
          'rgb( 229, 79, 72, .8)',
          'rgb(  103, 106, 102)',
          'rgb( 234, 237, 237, 0.5)'
        ],
        weight: .3
      },
      {
        data: [
          45,
          40,
          15,
          0,
          0
        ],
        backgroundColor: [
          'rgb( 97, 229, 70, .8)',
          'rgb(240, 226, 10, .8)',
          'rgb( 229, 79, 72, .8)',
          'rgb( 103, 106, 102)',
          'rgb( 234, 237, 237, 0.5)'
        ],
      }],
      labels: [
        'Bueno',
        'Moderado',
        'Alto'
      ]
    };

    const chart = new Chart(ctx, {
      data,
      type: 'doughnut',
      borderWidth: 5,
      options: {
        rotation: 1 * Math.PI,
        circumference: 1 * Math.PI,
        cutoutPercentage: 65
      }
    });
  }

  // --------------------------------------------------------------
  // Abre ventana con consejos
  // -> f() ->
  // Diana Hernández Soler
  // --------------------------------------------------------------
  public mostrarConsejos() {
    const txt = '<ul><li><h6>Ventilar la casa a diario</h6>Aunque parece una obviedad, es muy importante una adecuada ventilación para mejorar la calidad del aire interior</li>' +
      '<li><h6>Tener plantas de interior</h6>ayuda a renovar el aire interior de forma natural y efectiva</li> ' +
      '<li><h6>No fumar en espacios cerrados  </h6>  Encuentra la temperatura exacta para mantener la casa fresca y no abuses de su uso, dado que consume mucha energía.</li>' +
      '<li><h6>Ventilar bien la cocina</h6>y salir a la terraza o, si la casa lo permite, habilitar una zona para fumadores que esté aislada del resto del hogar y que pueda ventilarse con facilidad. Ahora, bien, si puedes fumar lo más lejos de tu hogar, mucho mejor</li>' +
      '<li><h6>Usar purificadores de aire  </h6>  Encuentra la temperatura exacta para mantener la casa fresca y no abuses de su uso, dado que consume mucha energía.</li>' +
      '<li><h6>usa de manera racional el aire acondicionado</h6>Encuentra la temperatura exacta para mantener la casa fresca y no abuses de su uso, dado que consume mucha energía.</li></ul>';
    this.helper.mostrarVentana(this.alertCtrl, txt, 'CONSEJOS');
  }

}
