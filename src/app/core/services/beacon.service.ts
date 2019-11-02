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

@Injectable()
export class Beacon {

    delegate: any;
    region: any;
    identifier: string = "Beacon-Equipo1";
    uuid: string = "45505347-2D47-5449-2D45-5155492D3031";

    constructor(public platform: Platform, public events: Events, public ibeacon: IBeacon, public device: Device) {
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
}