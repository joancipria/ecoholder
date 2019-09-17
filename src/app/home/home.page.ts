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
  deviceId = "24:0A:C4:9E:0A:BE";
  peripheral: any = {};
  airValue: String;


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
        //this.ble.autoConnect("24:0A:C4:9E:0A:BE", this.showToast("Connected"), this.showToast("Disconnected"));
        this.ble.connect(this.deviceId).subscribe(
          peripheral => this.onConnected(peripheral),
          peripheral => this.onDeviceDisconnected(peripheral)
        );
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
      },
      error => {
        this.showError("The user did not enable Bluetooth");
      }
    );
  }

  onConnected(peripheral) {
    this.ngZone.run(() => {
      this.peripheral = peripheral;
      this.ble.startNotification(peripheral.id, "bd7765d0-82dd-4f94-b1eb-e8b2c3036710", "4687a689-518f-469d-8710-29875142f531").subscribe(buffer => {
        console.log(this.bytesToString(buffer));
        this.ngZone.run(() => {
          this.airValue = this.bytesToString(buffer);
        });
      })
    });
  }

  onDeviceDisconnected(peripheral) {
    this.showToast("The peripheral unexpectedly disconnected");
  }

  // Disconnect peripheral when leaving the page
  ionViewWillLeave() {
    console.log('ionViewWillLeave disconnecting Bluetooth');
    this.ble.disconnect(this.peripheral.id).then(
      () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
      () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
    )
  }

  // ASCII only
  bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
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