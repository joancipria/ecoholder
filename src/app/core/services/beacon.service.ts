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
import { Firebase } from '../../core/services/firebase.service';



@Injectable()
export class Beacon {

    delegate: any;
    region: any;
    devices: any;
    newDevices: any[] = [];
    identifier: string = "Beacon-Equipo1";
    uuid: string = "45505347-2D47-5449-2D45-5155492D3031";
    targetBeacon: any;

    constructor(public platform: Platform, public events: Events, public ibeacon: IBeacon, public device: Device, public ble: BLE, public ngZone: NgZone,private firebase: Firebase) {
    }

    public async inicializar() {
        //await this.obtenerBeaconMasProximo();
        //this.uuid = this.targetBeacon.uuid;

        // Inicializar beacon
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

  /**********************************************
  @description Escanear dispositivos BLE cercanos
  @author Joan Ciprià Moreno Teodoro
  @date 30/11/2019
  ***********************************************/
    public escanearDispositivos() {
        let scanTime = 15;

        return new Promise((resolve, reject) => {
            this.newDevices = [];
           
            this.ble.scan([], scanTime).subscribe(
                device => this.onDispositvoEncontrado(device)
            );
            setTimeout(()=>{ 
                return resolve(this.newDevices); 
            }, scanTime*1000);            
        });
    }

  /**********************************************
  @description Obtener dispositivos dados de alta (desde firebase)
  @author Joan Ciprià Moreno Teodoro
  @date 30/11/2019
  ***********************************************/
    public async obtenerMisDispositivos(){
        this.devices = await this.firebase.getDevices();
        return this.devices;
    }

  /**********************************************
  @description Comprueba si el beacon continua emitiendo
  @author Joan Ciprià Moreno Teodoro
  @date 30/11/2019
  ***********************************************/
    public async obtenerBeaconMasProximo(){
        let beacon;

        // Mis dispositivos dados de alta
        let myDevices = await this.obtenerMisDispositivos();
        console.log("Mis dispositivos dados de alta", myDevices);
        console.log("Dispositivos cercanos ANTES", this.newDevices);

        // Dispositivos cercanos
        await this.escanearDispositivos();
        console.log("Dispositivos cercanos", this.newDevices);

        // Posibles dispositivos a los que conectar
        let targetDevices = [];

        // Recorremos los dispositivos disponibles
        for (let i = 0; i < this.newDevices.length; i++) {
           for (let z = 0; z < myDevices.length; z++) {
                if(this.newDevices[i].id == myDevices[z].id){
                    targetDevices.push(this.newDevices[i]); // Dispositivo dado de alta y disponible
                }  
           }
        }

        console.log("Dispositivos dados de alta y cerca:",targetDevices);
        
        // Para los dispositivos disponibles, obtener el más cercano
        let rssi = 0;
        if(targetDevices.length > 0){
            for (let i = 0; i < targetDevices.length; i++) {
               if( Math.abs(targetDevices[i].rssi) > rssi){
                    beacon = targetDevices[i];
                    rssi = Math.abs(targetDevices[i].rssi);
               }
            }
        }

        this.targetBeacon = beacon;
        console.log("Dispositivo más próximo", beacon);
        console.log("target", this.targetBeacon)
    }

  // ----------------------------------------------------------------
  // 
  //    Por cada dispositivo escaneado lo valido y hago push a la lista
  //    newDevices
  //             device: object -> f() -> 
  //
   //                  Vicent Borja Roca
  // ----------------------------------------------------------------

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