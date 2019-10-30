/*********************************************************************
@name LocalizadorGPS.service.ts
@description Servicio para obtener la ubicación actual y saber si
el usuario se ha movido
@author Joan Ciprià Moreno Teodoro
@date 27/09/2019
@license GPLv3
*********************************************************************/

// Librerías de angular/ionic 
import { Injectable } from "@angular/core";

// Cordova GPS plugin
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';


@Injectable()
export class LocalizadorGPS {
   public lat: any;
   public lng: any;

   constructor(
      private geolocation: Geolocation,
      private androidPermissions: AndroidPermissions,
      private locationAccuracy: LocationAccuracy
   ) {

   }

   //Check if application having GPS access permission  
   checkGPSPermission() {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
         result => {
            if (result.hasPermission) {

               //If having permission show 'Turn On GPS' dialogue
               this.askToTurnOnGPS();
            } else {

               //If not having permission ask for permission
               this.requestGPSPermission();
            }
         },
         err => {
            alert(err);
         }
      );
   }

   requestGPSPermission() {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
         if (canRequest) {
            console.log("4");
         } else {
            //Show 'GPS Permission Request' dialogue
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
               .then(
                  () => {
                     // call method to turn on GPS
                     this.askToTurnOnGPS();
                  },
                  error => {
                     //Show alert if user click on 'No Thanks'
                     alert('requestPermission Error requesting location permissions ' + error)
                  }
               );
         }
      });
   }

   askToTurnOnGPS() {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
         () => {
            // When GPS Turned ON call method to get Accurate location coordinates
            this.updatePosition()
         },
         error => alert('Error requesting location permissions ' + JSON.stringify(error))
      );
   }

   public updatePosition() {
      // Update gps
      this.geolocation.watchPosition()
         .subscribe(position => {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
         });
   }
}