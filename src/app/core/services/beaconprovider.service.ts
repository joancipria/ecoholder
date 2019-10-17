import { Injectable } from '@angular/core';
import { Platform, Events } from '@ionic/angular';
import { IBeacon } from "@ionic-native/ibeacon/ngx";
import { Device } from '@ionic-native/device/ngx';

@Injectable()
export class BeaconProvider {

    delegate: any;
    region: any;
    identifier: string = "Beacon-Equipo1";
    uuid: string = "EPSG-GTI-EQUI-01"

    constructor(public platform: Platform, public events: Events, public ibeacon: IBeacon, public device: Device) {
    }

    initialise(): any {
        let promise = new Promise((resolve, reject) => {
            // we need to be running on a device
            if (this.platform.is('cordova')) {

                // Request permission to use location on iOS
                this.ibeacon.requestAlwaysAuthorization();

                // create a new delegate and register it with the native layer
                this.delegate = this.ibeacon.Delegate();

                // Subscribe to some of the delegate's event handlers
                this.delegate.didRangeBeaconsInRegion()
                    .subscribe(
                        data => {
                            this.events.publish('didRangeBeaconsInRegion', data);
                        },
                        error => console.error()
                    );

                // setup a beacon region
                this.region = this.ibeacon.BeaconRegion(this.identifier, this.uuid);

                // start ranging
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

        return promise;
    }
}