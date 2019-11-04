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
   public mapa: any;
   public mapaCalor: any;
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
      let posicionActual = new google.maps.LatLng(
         this.gps.lat,
         this.gps.lng
      );

      // Opciones del mapa
      let mapOptions = {
         center: posicionActual,
         zoom: 13,
         mapTypeId: google.maps.MapTypeId.ROADMAP,
         zoomControl: false,
         streetViewControl: false,
      }

      // Creamos nueva instancia de DirectionsService y su renderer
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();


      // Renderizamos mapa en el dom con sus opciones
      this.mapa = new google.maps.Map(mapElement.nativeElement, mapOptions);

      // Creamos marcador personalizado para la posición actual
      let marcadorPosicionActual = new google.maps.Marker({
         position: posicionActual,
         map: this.mapa,
         icon: { url: "assets/maps/locationMarker.png", scaledSize: new google.maps.Size(20, 20) }
      });

      // Lo mostramos en el mapa
      marcadorPosicionActual.setMap(this.mapa);

      // Renderizar directions
      this.directionsRenderer.setMap(this.mapa);

      // Renderizar mapa calor
      this.renderizarMapaCalor();

      // Configuramos googleAutocomplete
      let defaultBounds = new google.maps.LatLngBounds(posicionActual);

      let autoCompleteOptions = {
         bounds: defaultBounds,
         types: ['establishment']
      };

      // Renderizamos autocomplete sobre el buscador
      this.googleAutocomplete = new google.maps.places.Autocomplete(await searchElement.getInputElement(), autoCompleteOptions)

      // Callback para cuando se seleccione un sitio del autocomplete
      this.googleAutocomplete.addListener('place_changed', () => {
         let place = this.googleAutocomplete.getPlace(); // obtenemos sitio seleccionado
         this.calcularRuta(place.name + " " + place.formatted_address); // calculamos ruta
      });

   }

   public cambiarRadius(radius: number) {
      this.mapaCalor.set('radius',  radius);

   }

   public cambiarGradiente(g: any) {
      this.mapaCalor.set('gradient', g);

   }

   private renderizarMapaCalor() {
      // Callback de firebase
      this.firebase.obtenerMedidas()
         .subscribe(data => {

            // Datos de firebase
            console.log("Data from firebase", data);

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
            this.mapaCalor = new google.maps.visualization.HeatmapLayer({
               radius: 30,
               data: heatMapData
            });
            this.mapaCalor.setMap(this.mapa);

         }
         )
   }

   // Mostrar/ocultar mapa calor
   public toggleMapaCalor() {
      this.mapaCalor.setMap(this.mapaCalor.getMap() ? null : this.mapa);
   }

   // Calculamos ruta desde ubicación actual hasta destino
   public calcularRuta(destination) {

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