import {Injectable} from "@angular/core";

// Cordova GPS plugin
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Injectable()
export class LocalizadorGPS {
   constructor(
      private geolocation: Geolocation
   ) {
      
   }

   obtenerMiPosicionGPS() {
      this.geolocation.getCurrentPosition().then((resp) => {
         console.log("https://www.google.com/maps/place/"+resp.coords.latitude+","+resp.coords.longitude);
        }).catch((error) => {
          console.log('Error getting location', error);
        });
   }

}