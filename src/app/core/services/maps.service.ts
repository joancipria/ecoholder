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
   public heatMap: any;

   constructor(
      private gps: LocalizadorGPS,
      public firebase: Firebase,
   ) {

   }

   // Inizializa el mapa sobre el elemento del DOM indidcado
   public async inicializarMapa(mapElement) {

      // Obtener posición actual
      let latLng = new google.maps.LatLng(
         this.gps.lat,
         this.gps.lng
      );

      let mapOptions = {
         center: latLng,
         zoom: 13,
         mapTypeId: google.maps.MapTypeId.ROADMAP,
         zoomControl: false,
         streetViewControl: false,
      }

      // Renderizar mapa
      this.map = new google.maps.Map(mapElement.nativeElement, mapOptions);

      // Renderizar mapa calor
      this.renderizarMapaCalor();
   }

   private renderizarMapaCalor() {
      // Callback de firebase
      this.firebase.getAllMeasures()
         .subscribe(data => {

            // Datos de firebase
            console.log(data);

            // Pequeño hack para poder leer los datos de firebase.
            // No se como se puede leer directamete sin que de fallo
            let rawData = JSON.stringify(data);
            let measures = JSON.parse(rawData);

            // Array datos heatmap
            let heatMapData = [];

            // Recorremos medidas
            for (let i = 0; i < measures.length; i++) {

               let coords = new google.maps.LatLng(
                  measures[i].latitude,
                  measures[i].longitude
               );
               //Rellenamos array heatmap con las medidas
               heatMapData.push(coords);
            }
            
            // Renderizamos mapa calor
            this.heatMap = new google.maps.visualization.HeatmapLayer({
               data: heatMapData
            });
            this.heatMap.setMap(this.map);

         }
         )
   }

   // Mostrar/ocultar mapa calor
   public toggleMapaCalor() {
      this.heatMap.setMap(this.heatMap.getMap() ? null : this.map);
    }

}