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


@Injectable()
export class LocalizadorGPS {
   private ultimaPosicion = {
      lat: undefined,
      lng: undefined
   }
   constructor(
      private geolocation: Geolocation
   ) {

   }

   public async obtenerMiPosicionGPS() {
      const resp = await this.geolocation.getCurrentPosition()
      this.ultimaPosicion.lat = resp.coords.latitude;
      this.ultimaPosicion.lng = resp.coords.longitude;
      return this.ultimaPosicion;
   }

}