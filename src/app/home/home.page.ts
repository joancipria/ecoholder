import { Component, NgZone, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import { AlertController, ToastController, NavController, Platform } from "@ionic/angular";

// Services
import { ReceptorBLE } from "../core/services/receptorBLE.service";
import { Firebase } from '../core/services/firebase.service';
import { Maps } from '../core/services/maps.service';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  @ViewChild('map', { static: false }) element;

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
    if(plt.is('android')){
      this.ble.inizializar();
    }
  }

  async showError(error) {
    const alert = await this.alertCtrl.create({
      header: "Error",
      subHeader: error,
      buttons: ["OK"]
    });
    await alert.present();
  }

  async showToast(msj) {
    const toast = await this.toastCtrl.create({
      message: msj,
      duration: 1000
    });
    await toast.present();
  }

  // Wait for dom
  ionViewDidEnter() {
    this.plt.ready().then(() => {
      this.maps.inicializarMapa(this.element);
    });
  }
}

interface pairedlist {
  class: number;
  id: string;
  address: string;
  name: string;
}