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
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

// Information moddal
import { InformationPage } from './information/information.page';

// tutorial Raquel
import { NavController, ModalController } from '@ionic/angular';
import { Helper } from '../core/helper';

// Firebase
import { Firebase } from '../core/services/firebase.service';

// Notificaciones
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public userImg: string;
  public sideMenu: boolean = false;
  public nodo: any[];
  public cards: any[];

  constructor(
    private ble: ReceptorBLE,
    public plt: Platform,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private helper: Helper,
    public modalController: ModalController,
    private firebase: Firebase,
    private localNotifications: LocalNotifications
  ) {
    if (plt.is('android')) {
      this.ble.inizializar();
    }
  }


  async ngOnInit() {
    this.sideMenu = this.helper.comprobarRol();
    this.showChart();
    this.userImg = this.helper.obtenerImagenGravatar();
    this.notificacion();
    this.notificarInactividad();
    // Raquel. Mostrar tutorial si es la primera vez
    //this.helper.MostrarTutorial(this.navCtrl, 'routes');
    // Raquel. Lista de rutas favoritas del usuario
    this.cards =  await this.firebase.rutasFavoritas()
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
        'Ok',
        'Warning',
        'Danger'
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

  /**********************************************
   @description Comprobar si el dispositivo está en mal estado para enviar notificacion
   @author Raquel Perpiñá Clérigues
   @date 12/01/2020
   ***********************************************/
  public async notificacion(){
    this.nodo = await this.firebase.estadoNodo()
    //console.log('NODO EN MAL ESTADO' + this.nodo);
    this.localNotifications.schedule({
      id: 1,
      title: 'Estado de los nodos',
      text: 'Los siguientes nodos se encuentran en mal estado: ' + this.nodo
    });
  }

  
   /**********************************************
   @description  Notificar al usuario tras un largo periodo de inactividad en el sensor
   @design medidasUsuario -> f() -> 
   @author Juan Andres Canet Rodriguez
   @date 07/01/2020
   ***********************************************/
  public async notificarInactividad() {
    var medidasUsuario = this.firebase.obtenerMedidas();

    if (medidasUsuario[0] < 5000){
      this.localNotifications.schedule({
        id: 1,
        title: '¡Hola!, ¿estas ahi?',
        text: 'Hace algún tiempo que no recibimos medidas de tus sensores'
      });
    }
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

  public async abrirInfo(){
    const modal = await this.modalController.create({
      component: InformationPage,
      componentProps: {parentRef: this}
    });
    return await modal.present();
  }
}
