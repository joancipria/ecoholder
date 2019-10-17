/*********************************************************************
@name Maps.service.ts
@description Renderiza un mapa de Google con las medidas obtenidas de la base de datos
@author Joan Ciprià Moreno Teodoro
@date 14/10/2019
@license GPLv3
*********************************************************************/

// Librerías de angular/ionic 
import { Injectable } from "@angular/core";

// Servicios propios

// GPS
import { LocalizadorGPS } from "../../core/services/LocalizadorGPS.service";

// Firebase
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
   public map: GoogleMap;

   constructor(
      public googleMaps: GoogleMaps,
      private gps: LocalizadorGPS,
      public firebase: Firebase,
   ) {

   }

   // Inizializa el mapa sobre el elemento del DOM indidcado
   public inicializarMapa(mapElement) {

      // Obtener las localizaciones de las medidas
      this.obtenerLocalizaciones();

      // Establecemos la API key para el navegador (es diferente a la de Android)
      if (document.URL.startsWith('http')) {
         Environment.setEnv({
            API_KEY_FOR_BROWSER_RELEASE: "AIzaSyDRJlCwAahLxcnY8Plxb5dnxVf6RlM0s2o",
            API_KEY_FOR_BROWSER_DEBUG: "AIzaSyDRJlCwAahLxcnY8Plxb5dnxVf6RlM0s2o"
         });
      }

      // Renderizamos el mapa
      this.map = GoogleMaps.create(mapElement.nativeElement);

      // Cuando haya  cargado el mapa
      this.map.one(GoogleMapsEvent.MAP_READY).then(async (data: any) => {
         // Obtenermos ubicación actual
         let coordinates: LatLng = new LatLng(
            await this.gps.obtenerMiPosicionGPS().then(coords => { return coords.lat }),
            await this.gps.obtenerMiPosicionGPS().then(coords => { return coords.lng })
         );

         let position = {
            target: coordinates,
            zoom: 17
         };

         // Animamos con Zoom
         this.map.animateCamera(position);

         // Añadimos un marcador (ejemplo)
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

   // Obtener las localizaciones de las medidas
   private obtenerLocalizaciones() {
      this.firebase.getAllMeasures()
         .subscribe(data => {
            console.log(data);
         }
         )
   }
}