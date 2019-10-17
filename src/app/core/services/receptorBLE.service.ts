import { Injectable } from "@angular/core";
import { Platform, Events } from '@ionic/angular';


// Fake server
import { ServidorFake } from "../../core/services/servidorFake.service";

// GPS
import { LocalizadorGPS } from "../../core/services/LocalizadorGPS.service";

// BLE
import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { BeaconProvider } from "../../core/services/beaconprovider.service";


@Injectable()
export class ReceptorBLE {
    so2: Number;
    latestMeasure: any = {};

    constructor(
        private servidor: ServidorFake,
        private gps: LocalizadorGPS,
        private ibeacon: IBeacon, 
        public beaconProvider: BeaconProvider, 
        public events: Events
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
            }else{
                this.so2 = undefined;
            }
        });
    }

    hayQueActualizarMedicionesYEnviarlasAlServidor(){
        //let measure = this.obtenerNox();
        this.actualizarMediciones().then(
            succes =>{
                if(this.latestMeasure.value != undefined){
                    this.servidor.guardarSo2(this.latestMeasure);
                }
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