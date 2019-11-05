import { Component, NgZone, ViewChild, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { AlertController, ToastController, NavController, Platform, IonSelect } from "@ionic/angular";

// Services
import { ReceptorBLE } from "../core/services/receptorBLE.service";
import { Firebase } from '../core/services/firebase.service';
import { Maps } from '../core/services/maps.service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.page.html',
  styleUrls: ['./routes.page.scss'],
})
export class RoutesPage implements OnInit {
  @ViewChild('map', { static: false }) element;
  @ViewChild('search', { static: false }) elementSearch;
  showSelectContaminante: boolean = false;
  @ViewChild('select', { static: false }) select: IonSelect;

  constructor(
    private router: Router,
    public navCtrl: NavController,
    private ble: ReceptorBLE,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private ngZone: NgZone,
    public firebase: Firebase,
    public maps: Maps,
    public plt: Platform
  ) {
    if (plt.is('android')) {
      this.ble.inizializar();
    }
  }

  ngOnInit() {
  }

  // Wait for dom
  ionViewWillEnter() {
    this.plt.ready().then(() => {
      // Load just once
        this.maps.inicializarMapa(this.element, this.elementSearch);
    });
  }

// ----------------------------------------------------------------------
// Evento que se ejecuta al cambiar de contaminante
// evento onChange -> f() ->
// ------------------------------------------------------------------------
  onChangeContaminante($event) {

        console.log("el sensor seleccionado es: " + $event.target.value);

        const contaminanteSeleccionado =  $event.target.value;
        switch(contaminanteSeleccionado) {
          case 'CO2':
              const g = [
                'rgba(255, 0, 0, 0)',
                'rgba(255, 255, 0, 0.9)',
                'rgba(0, 255, 0, 0.7)',
                'rgba(173, 255, 47, 0.5)',
                'rgba(152, 251, 152, 0)',
                'rgba(152, 251, 152, 0)',
                'rgba(0, 0, 238, 0.5)',
                'rgba(186, 85, 211, 0.7)',
                'rgba(255, 0, 255, 0.9)',
                'rgba(255, 0, 0, 1)'];
                this.maps.cambiarGradiente(g);

            this.maps.cambiarRadius(60);
            break;
          case 'NOX':


      const gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
      ];
            this.maps.cambiarGradiente(gradient);
            this.maps.cambiarRadius(80);
            break;

          case 'SO2':
            this.maps.cambiarRadius(20);

        }
      }

  calcRoute(destination){
    this.maps.calcularRuta(destination);
  }


// ----------------------------------------------------------------------
// Mostrar / Ocultar el select de contaminante
// -> f() ->
// ------------------------------------------------------------------------
  toggleSelectorContaminante() {
    this.select.open();
    //this.showSelectContaminante = !this.showSelectContaminante;
    // this.maps.toggleMapaCalor();
  }

}
