import { Injectable } from "@angular/core";

// GPS
import { LocalizadorGPS } from "../../core/services/LocalizadorGPS.service";

import {
   GoogleMaps,
   GoogleMap,
   GoogleMapsEvent,
   LatLng,
   MarkerOptions,
   Marker,
   Environment
} from "@ionic-native/google-maps";


@Injectable()
export class Maps {
   constructor(
      public googleMaps: GoogleMaps,
      private gps: LocalizadorGPS
   ) {

   }

   initMap(mapElement) {

      if (document.URL.startsWith('http')) {
         Environment.setEnv({
            API_KEY_FOR_BROWSER_RELEASE: "AIzaSyDRJlCwAahLxcnY8Plxb5dnxVf6RlM0s2o",
            API_KEY_FOR_BROWSER_DEBUG: "AIzaSyDRJlCwAahLxcnY8Plxb5dnxVf6RlM0s2o"
         });
      }

      let map: GoogleMap = this.googleMaps.create(mapElement.nativeElement);

      map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {
         // await  this.gps.obtenerMiPosicionGPS().then(coords =>{return coords.lat})
         let coordinates: LatLng = new LatLng(38.9932656, -0.1628125);

         let position = {
            target: coordinates,
            zoom: 17
         };

         map.animateCamera(position);

         let markerOptions: MarkerOptions = {
            position: coordinates,
            //icon: "assets/images/icons8-Marker-64.png",
            //title: 'Our first POI'
         };

         const marker = map.addMarker(markerOptions)
            .then((marker: Marker) => {
               marker.showInfoWindow();
            });
      })
   }
}