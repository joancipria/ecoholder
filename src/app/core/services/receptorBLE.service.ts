/*********************************************************************
@name ReceptorBle.service.ts
@description Lee las tramas emitidas por el módulo SparkFun Pro nRF52840 Mini 
y actualiza las mediciones.
@author Joan Ciprià Moreno Teodoro
@date 10/09/2019
@license GPLv3
*********************************************************************/

// Librerías de angular/ionic 
import { Injectable } from "@angular/core";
import { Events } from '@ionic/angular';


// Servicios propios

// Lógica false del servidor
import { ServidorFake } from "../../core/services/servidorFake.service";

// GPS
import { LocalizadorGPS } from "../../core/services/LocalizadorGPS.service";

// Beacon
import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { Beacon } from "./beacon.service";


@Injectable()
export class ReceptorBLE {
    // Última medida de azufre
    private so2: Number;

    // Última medida
    private ultimaMedida: any = {};

    constructor(
        private servidor: ServidorFake,
        private gps: LocalizadorGPS,
        private ibeacon: IBeacon,
        private beacon: Beacon,
        private events: Events
    ) {

    }

    public async inizializar() {
        // Activar ble si no lo está
        if (!this.estaBLEactivado()) {
            await this.activarBLE();
        }

        // Inicializar servicio de beacon
        this.beacon.inicializar().then((isInitialised) => {
            if (isInitialised) {
                this.obtenerMisTramas();
            }
        });

        // "Alarma" temporal, actualizar mediciones y enviar al servidor cada 10 segundos
        setInterval(() => {
            this.hayQueActualizarMedicionesYEnviarlasAlServidor();
        }, 10000);
    }

    public estaBLEactivado() {
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

    public activarBLE() {
        this.ibeacon.enableBluetooth().then(
            success => {
                console.log("Bluetooth is enabled");
            },
            error => {
                console.log("Error enabling bluetooth");
            }
        );
    }

    public async actualizarMediciones() {
        this.ultimaMedida = {
            value: this.so2, // última medida de azufre
            date: +new Date(), // timestamp actual
            latitude: this.gps.lat, // obtener ubicación actual
            longitude: this.gps.lng,
        }
    }

    private obtenerMisTramas() {
        // Callback al detectar el beacon
        this.events.subscribe('didRangeBeaconsInRegion', async (data) => {

            // Guardar medida sólo si el beacon está emitiendo datos
            if (data.beacons.length > 0) {
                console.log("Received beacon: "+data.beacons[0].major);
                this.so2 = parseInt(data.beacons[0].major);
            } else {
                this.so2 = undefined;
            }
        });
    }

    // Temporal, este método no pertenece a esta clase. Ver diseño
    public hayQueActualizarMedicionesYEnviarlasAlServidor() {
        //let measure = this.obtenerSO2();
        this.actualizarMediciones().then(
            succes => {
                if (this.ultimaMedida.value != undefined) {
                    this.servidor.guardarSo2(this.ultimaMedida);
                }
            },
            error => {
                console.log("Error al actualizar mediciones")
            }
        )
    }

    /*public obtenerSO2() {
        this.actualizarMediciones().then(
            succes =>{
                return this.ultimaMedida;
            },
            error => {
                console.log("Error al actualizar mediciones")
            }
        )
    }*/
}