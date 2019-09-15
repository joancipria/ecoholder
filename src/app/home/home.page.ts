import { Component, NgZone } from "@angular/core";
import { Router } from '@angular/router';
import { BLE } from "@ionic-native/ble/ngx";
import { AlertController, ToastController, NavController } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  devices: any[] = [];
  statusMessage: string;

  constructor(
    private router: Router,
    public navCtrl: NavController,
    private ble: BLE,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private ngZone: NgZone
  ) {
    this.checkBluetooth();
  }

  checkBluetooth() {
    this.ble.isEnabled().then(
      success => {
        this.showToast("Bluetooth is enabled");
        this.listDevices();
      },
      error => {
        this.showError("Bluetooth is not enabled");
        this.enableBluetooth();
      }
    );
  }

  enableBluetooth() {
    this.ble.enable().then(
      success => {
        this.showToast("Bluetooth is enabled");
        this.listDevices();
      },
      error => {
        this.showError("The user did not enable Bluetooth");
      }
    );
  }

  listDevices() {
    this.showToast("Scanning");
    this.devices = [];

    this.ble
      .scan([], 5)
      .subscribe(
        device => this.onDeviceDiscovered(device),
        error => this.showError("No devices because " + error)
      );
    setTimeout(this.showToast.bind(this), 5000, "Scan complete");
  }

  onDeviceDiscovered(device) {
    this.showToast("Discovered " + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
    });
  }

  scan() {
    this.showToast('Scanning for Bluetooth LE Devices');
    this.devices = [];  // clear list

    this.ble.scan([], 5).subscribe(
      device => this.onDeviceDiscovered(device), 
      error => this.scanError(error)
    );

    setTimeout(this.showToast.bind(this), 5000, 'Scan complete');
  }

    // If location permission is denied, you'll end up here
    scanError(error) {
      //this.setStatus('Error ' + error);
      this.showToast("Error scanning for Bluetooth low energy devices: "+error.message)
    }

  deviceSelected(device) {
    console.log(JSON.stringify(device) + ' selected');
    this.router.navigateByUrl("detail?dev="+JSON.stringify(device));
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