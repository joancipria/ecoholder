import { Injectable } from "@angular/core";

// GPS
import { LocalizadorGPS } from "../../core/services/LocalizadorGPS.service";
import { Firebase } from '../../core/services/firebase.service';


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
   public locations: any;
   public map: GoogleMap;

   constructor(
      public googleMaps: GoogleMaps,
      private gps: LocalizadorGPS,
      public firebase: Firebase,
   ) {

   }

   initMap(mapElement) {

      // Get data
      this.getLocations();

      // Set api key for browser
      if (document.URL.startsWith('http')) {
         Environment.setEnv({
            API_KEY_FOR_BROWSER_RELEASE: "AIzaSyDRJlCwAahLxcnY8Plxb5dnxVf6RlM0s2o",
            API_KEY_FOR_BROWSER_DEBUG: "AIzaSyDRJlCwAahLxcnY8Plxb5dnxVf6RlM0s2o"
         });
      }

      // Render map
      this.map = GoogleMaps.create(mapElement.nativeElement);

      // On map ready
      this.map.one(GoogleMapsEvent.MAP_READY).then(async (data: any) => {
         // Get current locations
         let coordinates: LatLng = new LatLng(
            await this.gps.obtenerMiPosicionGPS().then(coords => { return coords.lat }),
            await this.gps.obtenerMiPosicionGPS().then(coords => { return coords.lng })
         );

         let position = {
            target: coordinates,
            zoom: 17
         };

         // Zoom
         this.map.animateCamera(position);





         let markerOptions: MarkerOptions = {
            position: coordinates,
            //icon: "assets/images/icons8-Marker-64.png",
            title: 'Medida'
         };

         const marker = this.map.addMarker(markerOptions)
            .then((marker: Marker) => {
               marker.showInfoWindow();
            });
      })
   }

   getLocations(){
      this.firebase.getAllMeasures()
      .subscribe(data => {
         console.log(data);
         }
      )
   }
}