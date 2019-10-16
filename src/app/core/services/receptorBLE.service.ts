import { Injectable } from "@angular/core";

// Cordova BLE plugin
import { BLE } from "@ionic-native/ble/ngx";

// Fake server
import { ServidorFake } from "../../core/services/servidorFake.service";

// GPS
import { LocalizadorGPS } from "../../core/services/LocalizadorGPS.service";

import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { BeaconProvider } from "../../core/services/beaconprovider.service";
import { Platform, Events } from '@ionic/angular';


@Injectable()
export class ReceptorBLE {
    so2: Number;
    latestMeasure: any = {};

    constructor(
        private ble: BLE,
        private servidor: ServidorFake,
        private gps: LocalizadorGPS,
        private ibeacon: IBeacon, public beaconProvider: BeaconProvider, public events: Events
    ) {

    }

    async inizializar() {
        if (!this.estaBLEactivado()) {
            await this.activarBLE();
        }

        this.beaconProvider.initialise().then((isInitialised) => {
            if (isInitialised) {
                this.obtenerMisTramas();
            }
        });

        setInterval(() => { 
            this.hayQueActualizarMedicionesYEnviarlasAlServidor();
         }, 5000);
    }

    estaBLEactivado() {
        this.ibeacon.isBluetoothEnabled().then(
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
        this.ibeacon.enableBluetooth().then(
            success => {
                console.log("Bluetooth is enabled");
            },
            error => {
                console.log("Error enabling bluetooth");
            }
        );
    }

    async actualizarMediciones() { 
        this.latestMeasure = {
            value: this.so2,
            date: +new Date(),
            latitude: await this.gps.obtenerMiPosicionGPS().then(coords => { return coords.lat }),
            longitude: await this.gps.obtenerMiPosicionGPS().then(coords => { return coords.lng }),
        }
    }

    obtenerMisTramas() {
        this.events.subscribe('didRangeBeaconsInRegion', async (data) => {

            let beacons = [];

            let beaconList = data.beacons;
            beaconList.forEach((beacon) => {
                let beaconObject = beacon;
                beacons.push(beaconObject);
            });

            if (beacons.length > 0) {
                this.so2 = parseInt(beacons[0].major);
            }
        });
    }

    hayQueActualizarMedicionesYEnviarlasAlServidor(){
        //let measure = this.obtenerNox();
        this.actualizarMediciones().then(
            succes =>{
                this.servidor.guardarSo2(this.latestMeasure);
            },
            error => {
                console.log("Error al actualizar mediciones")
            }
        )
    }

    /*obtenerNox() {
        this.actualizarMediciones().then(
            succes =>{
                return this.latestMeasure;
            },
            error => {
                console.log("Error al actualizar mediciones")
            }
        )
    }*/
}