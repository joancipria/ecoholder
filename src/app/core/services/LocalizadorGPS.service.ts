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
import { Platform } from '@ionic/angular';

// Cordova GPS plugin
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';


@Injectable()
export class LocalizadorGPS {
   public lat: any;
   public lng: any;
   public latAnterior: any;
   public lngAnterior: any;

   constructor(
      private geolocation: Geolocation,
      private androidPermissions: AndroidPermissions,
      private locationAccuracy: LocationAccuracy,
      public plt: Platform
   ) {

   }

   public inicializar() {
      // Si estamos en android
      if (this.plt.is('android')) {
         // Verificar permisos android
         this.verificarPermisosGPS();
      } else {
         // Si estamos en web, directamente monitorizar posicion
         this.monitorizarPosicion();
      }


   }

    

   // Verificar si tenemos permisos para el GPS
   public verificarPermisosGPS() {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
         result => {
            if (result.hasPermission) {
               // Si tenemos permiso, preguntar para activar GPS
               this.activarGPS();
            } else {
               // Si no tenemos permiso
               this.pedirPermisoGPS();
            }
         },
         err => {
            alert(err);
         }
      );
   }

   // Pedir permisos para el GPS
   public pedirPermisoGPS() {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
         if (canRequest) {
            //
         } else {
            // Pedir permisos
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
               .then(
                  () => {
                     // Si tenemos permiso, activar el GPS
                     this.activarGPS();
                  },
                  error => {
                     // Mostrar error si el usuario rechaza dar permisos
                     console.log("Error requesting location permissions " + error)
                  }
               );
         }
      });
   }

   // Activar el GPS
   public activarGPS() {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
         () => {
            // Cuando activamos el GPS, monitorizar posición
            this.monitorizarPosicion()
         },
         error => alert('Error requesting location permissions ' + JSON.stringify(error))
      );
   }

   // Monitorizar posición en tiempo real
   public monitorizarPosicion() {
      // Cada vez que el usuario se mueva, actualizar posición
      this.geolocation.watchPosition()
         .subscribe(position => {
            console.log("Posición actual: ", this.lat +","+this.lng);            
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
         });
   }

   
//---------------------------------------------------------------------------------------------------
   //          double, double --> meHeMovido() --> V/F 
   //          Autor: Vicent Borja Roca
   //          Descripción: Comprueba si la distancia desde la posición anterior a la posición actual
   //                       es mayor que 60m mediante la formula de Haversine de la distancia de 
   //                       circulo máximo https://en.wikipedia.org/wiki/Haversine_formula
   //----------------------------------------------------------------------------------------------------

   public meHeMovido(){

      if(this.latAnterior == undefined){
         return true;
      }
      
      var latActual = this.lat;
      var lngActual = this.lng;

      var R = 6371e3; 
      var toRadians =  Math.PI/180;
      var φ1 = this.latAnterior*toRadians;
      var φ2 = latActual*toRadians;
      var Δφ = (latActual-this.latAnterior)*toRadians;
      var Δλ = (lngActual-this.lngAnterior)*toRadians;
      
      var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      
      var d = R * c;

      console.log(d);
   
      if(d>60){

            return true;

      }

      return false;

   } 
}