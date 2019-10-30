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
   public directionsService: any;
   public directionsRenderer: any;
   public googleAutocomplete: any;


   constructor(
      private gps: LocalizadorGPS,
      public firebase: Firebase,
   ) {

   }

   // Inizializa el mapa sobre el elemento del DOM indidcado
   public async inicializarMapa(mapElement, searchElement) {

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

      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();


      // Renderizar mapa
      this.map = new google.maps.Map(mapElement.nativeElement, mapOptions);

      // Renderizar directions
      this.directionsRenderer.setMap(this.map);


      // Renderizar mapa calor
      this.renderizarMapaCalor();

      let defaultBounds = new google.maps.LatLngBounds(
         new google.maps.LatLng(this.gps.lat,this.gps.lng));

      let autoCompleteOptions = {
         bounds: defaultBounds,
         types: ['establishment']
       };
       
      this.googleAutocomplete = new google.maps.places.Autocomplete(await searchElement.getInputElement(),autoCompleteOptions)

      this.googleAutocomplete.addListener('place_changed', () => {
         let place = this.googleAutocomplete.getPlace();
         this.calcRoute(place.name + " " + place.formatted_address);
      });

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

   public calcRoute(destination) {

      let latLng = new google.maps.LatLng(
         this.gps.lat,
         this.gps.lng
      )

      let start = latLng;
      let end = destination;
      let request = {
         origin: start,
         destination: end,
         travelMode: 'BICYCLING'
      };
      this.directionsService.route(request, (result, status) => {
         if (status == 'OK') {
            this.directionsRenderer.setDirections(result);
         }
      });
   }


}