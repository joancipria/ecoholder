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


declare var google;

@Injectable()
export class Maps {
   public map: any;

   constructor(
      private gps: LocalizadorGPS,
      public firebase: Firebase,
   ) {

   }

   // Inizializa el mapa sobre el elemento del DOM indidcado
   public async inicializarMapa(mapElement) {

         let latLng = new google.maps.LatLng(
         await this.gps.obtenerMiPosicionGPS().then(coords => { return coords.lat }), 
         await this.gps.obtenerMiPosicionGPS().then(coords => { return coords.lng })
         );

         let mapOptions = {
           center: latLng,
           zoom: 15,
           mapTypeId: google.maps.MapTypeId.ROADMAP
         }
       
         this.map = new google.maps.Map(mapElement.nativeElement, mapOptions);
         //this.renderizarMarcadores();
   }

   /*private renderizarMarcadores() {
      // Callback de firebase
      this.firebase.getAllMeasures()
         .subscribe(data => {

            // Datos de firebase
            console.log(data);

            // Pequeño hack para poder leer los datos
            let rawData = JSON.stringify(data);
            let obj = JSON.parse(rawData);

            // Limpiamos mapa
            this.map.clear();

            // Añadimos un marcador por cada medida
            for (let i = 0; i < obj.length; i++) {

               let coords: LatLng = new LatLng(
                  obj[i].latitude,
                  obj[i].longitude
               );

               let markerOptions: MarkerOptions = {
                  position: coords,
                  //icon: "assets/images/icons8-Marker-64.png",
                  title: "SO2: " + String(obj[i].value)
               };

               const marker = this.map.addMarker(markerOptions)
                  .then((marker: Marker) => {
                     marker.showInfoWindow();
                  });

            }

         }
         )
   }*/
}