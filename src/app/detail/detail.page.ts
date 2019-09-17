import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { BLE } from "@ionic-native/ble/ngx";

@Component({
  selector: "page-detail",
  templateUrl: "detail.page.html",
  styleUrls: ["detail.page.scss"]
})
export class DetailPage {

  peripheral: any = {};
  statusMessage: string;
  airValue: String;

  constructor(
    private platform: Platform,
              private route: ActivatedRoute, 
              private router: Router,
              public navCtrl: NavController, 
              private ble: BLE,
              private toastCtrl: ToastController,
              private ngZone: NgZone) {

                let device = JSON.parse(this.platform.getQueryParam("dev"));

    this.showToast('Connecting to ' + device.name || device.id);

    this.ble.connect(device.id).subscribe(
      peripheral => this.onConnected(peripheral),
      peripheral => this.onDeviceDisconnected(peripheral)
    );
  }

  onConnected(peripheral) {
    this.ngZone.run(() => {
      //this.setStatus('');
      this.peripheral = peripheral;
      this.ble.startNotification(peripheral.id, "bd7765d0-82dd-4f94-b1eb-e8b2c3036710","4687a689-518f-469d-8710-29875142f531").subscribe(buffer=>{
        console.log(this.bytesToString(buffer));
        this.ngZone.run(() => {
          this.airValue = this.bytesToString(buffer);
        });
      })
    });
  }



  onDeviceDisconnected(peripheral) {
   /* let toast = this.toastCtrl.create({
      message: 'The peripheral unexpectedly disconnected',
      duration: 3000,
      position: 'middle'
    });
    toast.present();*/
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

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  async showToast(msj) {
    const toast = await this.toastCtrl.create({
      message: msj,
      duration: 1000
    });
    await toast.present();
  }

  // ASCII only
bytesToString(buffer) {
  return String.fromCharCode.apply(null, new Uint8Array(buffer));
}


}
