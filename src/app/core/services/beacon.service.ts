/*********************************************************************
@name Beacon.service.ts
@description Crea una BeaconRegion y devuelve una promesa con cada evento
@author Joan Ciprià Moreno Teodoro
@date 13/10/2019
@license GPLv3
*********************************************************************/

import { Injectable } from '@angular/core';
import { Platform, Events } from '@ionic/angular';
import { IBeacon } from "@ionic-native/ibeacon/ngx";
import { Device } from '@ionic-native/device/ngx';
import { BLE } from '@ionic-native/ble/ngx';
import { NgZone } from '@angular/core';



@Injectable()
export class Beacon {

    delegate: any;
    region: any;
    newDevices: any[] = [];
    identifier: string = "Beacon-Equipo1";
    uuid: string = "45505347-2D47-5449-2D45-5155492D3031";

    constructor(public platform: Platform, public events: Events, public ibeacon: IBeacon, public device: Device, public ble: BLE, public ngZone: NgZone) {
    }

    public inicializar(): any {
        let promise = new Promise((resolve, reject) => {
            // Necesitamos cordova para utilizar el servicio
            if (this.platform.is('cordova')) {

                // Solicitar permisos de localización en iOS
                this.ibeacon.requestAlwaysAuthorization();

                // Crear un nuevo delegado
                this.delegate = this.ibeacon.Delegate();

                // Suscribirse al evento didRangeBeaconsInRegion
                this.delegate.didRangeBeaconsInRegion()
                    .subscribe(
                        data => {
                            this.events.publish('didRangeBeaconsInRegion', data);
                        },
                        error => console.error()
                    );

                // Crear una region con los datos de la UUID y el identificador
                this.region = this.ibeacon.BeaconRegion(this.identifier, this.uuid);

                // Escaner en busca de beacons
                this.ibeacon.startRangingBeaconsInRegion(this.region)
                    .then(
                        () => {
                            resolve(true);
                        },
                        error => {
                            console.error('Failed to begin monitoring: ', error);
                            resolve(false);
                        }
                    );


            } else {
                console.error("This application needs to be running on a device");
                resolve(false);
            }
        });

        // Devolvemos la promesa
        return promise;
    }

    escanearDispositivos() {
        this.newDevices = [];
        this.ble.scan([], 15).subscribe(
            device => this.onDispositvoEncontrado(device)
        );

        return this.newDevices;
    }

    onDispositvoEncontrado(device) {
        console.log('Discovered' + JSON.stringify(device, null, 2));
        this.ngZone.run(() => {
            if (typeof device.name === 'undefined' || device.name != this.identifier) {
                console.log('dispositivo no valido');
            } else {
                console.log('dispositivo valido: ' + device.name);
                this.newDevices.push(device);
            }
        })
    }



}