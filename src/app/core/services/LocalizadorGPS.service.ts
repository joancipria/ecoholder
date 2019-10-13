import { Injectable } from "@angular/core";

// Cordova GPS plugin
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Injectable()
export class LocalizadorGPS {
   public lat;
   public lng;
   constructor(
      private geolocation: Geolocation
   ) {

   }

   async obtenerMiPosicionGPS() {
      const resp = await this.geolocation.getCurrentPosition()
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      return { lat: this.lat, lng: this.lng }
   }

}