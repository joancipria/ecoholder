import { Component, NgZone } from "@angular/core";
import { Router } from '@angular/router';
import { BLE } from "@ionic-native/ble/ngx";
import { AlertController, ToastController, NavController } from "@ionic/angular";

// Services
import { ReceptorBLE } from "../core/services/receptorBLE.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  deviceId = "24:0A:C4:9E:0A:BE";
  airValue: String;


  constructor(
    private router: Router,
    public navCtrl: NavController,
    private ble: ReceptorBLE,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private ngZone: NgZone
  ) {
    this.ble.inizializar();
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
}

interface pairedlist {
  class: number;
  id: string;
  address: string;
  name: string;
}