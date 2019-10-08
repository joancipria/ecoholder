import { Injectable } from "@angular/core";

// Cordova BLE plugin
import { BLE } from "@ionic-native/ble/ngx";


@Injectable()
export class ReceptorBLE {
    peripheral: any = {};
    deviceMAC = "C4:17:3F:A1:4A:1B";
    serviceUUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
    charUUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

    constructor(
        private ble: BLE,
    ) {

    }

    async inizializar() {
        if (!this.estaBLEactivado()) {
            await this.activarBLE();
        }
        this.conectar(this.deviceMAC);
    }

    estaBLEactivado() {
        this.ble.isEnabled().then(
            success => {
                return true;
            },
            error => {
                return false;
            }
        );
        return false;
    }

    activarBLE() {
        this.ble.enable().then(
            success => {
                console.log("Bluetooth is enabled");
            },
            error => {
                console.log("Error enabling bluetooth");
            }
        );
    }

    conectar(deviceId) {
        this.ble.connect(deviceId).subscribe(
            peripheral => this.onConnected(peripheral),
            peripheral => this.onDeviceDisconnected(peripheral)
        );
    }

    onConnected(peripheral) {
        this.peripheral = peripheral;
        console.log(this.peripheral);
        this.ble.startNotification(peripheral.id, this.serviceUUID, this.charUUID).subscribe(buffer => {
            console.log(this.bytesToString(buffer));
        })
    }

    onDeviceDisconnected(peripheral) {
        //this.showToast("The peripheral unexpectedly disconnected");
    }

    // ASCII only
    private bytesToString(buffer) {
        return String.fromCharCode.apply(null, new Uint8Array(buffer));
    }


}