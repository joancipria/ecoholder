import { Component, NgZone, ViewChild, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { AlertController, ToastController, NavController, Platform } from "@ionic/angular";

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

  onChange($event) {
        console.log("el sensor seleccionado es: " + $event.target.value);
      }

  calcRoute(destination){
    this.maps.calcRoute(destination);
  }

}
