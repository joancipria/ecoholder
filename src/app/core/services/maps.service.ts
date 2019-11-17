/*********************************************************************
@name Maps.service.ts
@description Renderiza un mapa de Google con las medidas obtenidas de la base de datos
@author Joan Ciprià Moreno Teodoro
@date 14/10/2019
@license GPLv3
*********************************************************************/

// Librerías de angular/ionic
import { Injectable } from '@angular/core';

// Servicios propios
// GPS
import { LocalizadorGPS } from '../../core/services/LocalizadorGPS.service';

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
   public lastMeasuresStation: any;


   constructor(
      private gps: LocalizadorGPS,
      public firebase: Firebase,
   ) {

   }

   // Inizializa el mapa sobre el elemento del DOM indidcado
   public async inicializarMapa(mapElement, searchElement) {

      // Obtener posición actual
      const posicionActual = new google.maps.LatLng(
         this.gps.lat,
         this.gps.lng
      );

      // Opciones del mapa
      const mapOptions = {
         center: posicionActual,
         zoom: 13,
         mapTypeId: google.maps.MapTypeId.ROADMAP,
         zoomControl: false,
         streetViewControl: false,
      };

      // Mostramos la estación de medida de Gandía en el mapa
      this.mostrarEstacionDeMedida();

      // Creamos nueva instancia de DirectionsService y su renderer
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();


      // Renderizamos mapa en el dom con sus opciones
      this.mapa = new google.maps.Map(mapElement.nativeElement, mapOptions);

      // Creamos marcador personalizado para la posición actual
      const marcadorPosicionActual = new google.maps.Marker({
         position: posicionActual,
         map: this.mapa,
         icon: { url: 'assets/maps/locationMarker.png', scaledSize: new google.maps.Size(20, 20) }
      });

      // Lo mostramos en el mapa
      marcadorPosicionActual.setMap(this.mapa);

      // Renderizar directions
      this.directionsRenderer.setMap(this.mapa);

      // Renderizar mapa calor
      this.renderizarMapaCalor();

      // Configuramos googleAutocomplete
      const defaultBounds = new google.maps.LatLngBounds(posicionActual);

      const autoCompleteOptions = {
         bounds: defaultBounds,
         types: ['establishment']
      };

      // Renderizamos autocomplete sobre el buscador
      this.googleAutocomplete = new google.maps.places.Autocomplete(await searchElement.getInputElement(), autoCompleteOptions);

      // Callback para cuando se seleccione un sitio del autocomplete
      this.googleAutocomplete.addListener('place_changed', () => {
         const place = this.googleAutocomplete.getPlace(); // obtenemos sitio seleccionado
         this.calcularRuta(place.name + ' ' + place.formatted_address); // calculamos ruta
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
            console.log('Data from firebase', data);

            // Pequeño hack para poder leer los datos de firebase.
            // No se como se puede leer directamete sin que de fallo
            const rawData = JSON.stringify(data);
            const measures = JSON.parse(rawData);

            // Array datos heatmap
            const heatMapData = [];

            // Recorremos medidas
            for (let i = 0; i < measures.length; i++) {

               const coords = new google.maps.LatLng(
                  measures[i].latitude,
                  measures[i].longitude
               );
               // Rellenamos array heatmap con las medidas
               heatMapData.push(coords);
            }

            // Renderizamos mapa calor
            this.mapaCalor = new google.maps.visualization.HeatmapLayer({
               radius: 30,
               data: heatMapData
            });
            this.mapaCalor.setMap(this.mapa);

         }
         );
   }

   // Mostrar/ocultar mapa calor
   public toggleMapaCalor() {
      this.mapaCalor.setMap(this.mapaCalor.getMap() ? null : this.mapa);
   }

   // Calculamos ruta desde ubicación actual hasta destino
   public calcularRuta(destination) {

      const latLng = new google.maps.LatLng(
         this.gps.lat,
         this.gps.lng
      );

      const start = latLng;
      const end = destination;
      const request = {
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

   // ----------------------------------------------------------------
   // Colocar marker con la estación de medida de Gandía
   // -> f() ->
   // Diana Hernández Soler
   // ----------------------------------------------------------------
   private mostrarEstacionDeMedida() {

     // Obtenemos las últimas medidas de la estación oficial de Gandía
      this.firebase.obtenerUltimasMedidasEstacionOfical().subscribe((data: any) => {
         this.lastMeasuresStation = data[0];
      });

      // Ruta al icono personalizado para las estaciones de medida
      const urlIcon = 'assets/maps/IconoEstacionDeMedida.png';

      // Obtención de la información de la estación de medida de Gandía
      this.firebase.obtenerEstacionDeMedida().subscribe((res: any) => {

      // Parsearmos los datos recibidos de Firestore para su correcta visualización
      const station = this.parsearDatos(res);
      console.log('map service', station);

      // Creación del objeto LatLng de Google Maps con las coordenadas de la estación
      const LocalizacionEstacion = new google.maps.LatLng(
         station.latitude,
         station.longitude
      );

      // Creación del Marker y posicionamiento sobre el mapa
      const marker = new google.maps.Marker({
               position: LocalizacionEstacion,
               map: this.mapa,
               title: 'Estación medida Gandía',
               icon: { url: urlIcon, scaledSize: new google.maps.Size(50, 50) },
            });

      // Contenido del infowindow
      const infowindowContent = "<div><header style=\'width:100%;height:40px;margin: 0 auto;background-color:green;padding: 5px;\'><h3 style=\'  width:100%;margin: 0 auto;color:white;\'>ESTACIÓN DE GANDIA</h3></header><main style=\'margin: 10px 0;\'><section style=\'  display:flex; justify-content: center\'><img  width=\'30%\'  style=\'margin:10px;padding-left:5px;\' src=\'assets/img/estacionGandia.jpg\'><article> <br />Dirección " 
         + station.address + "<br /> Código   46131002 <br /> Longitud"
         + station.longitude + " <br />Latitud " 
         + station.latitude + "<br /> Altitud   "
         + station.altitude + " m <br /></article></section><section style=\'margin-top: 5px;width:90%;margin: 0 auto;\'><h3>ÚLTIMAS MEDIDAS<span style=\'display:block;font-size: 12px;\'> "
         + this.lastMeasuresStation.date + "</span></h3><table border=\'1\' style=\'  border-collapse:collapse;margin:10px 5px;\'><tr><th style=\'width: 60px;height:30px;text-align: center;\'>SO2</th><th style=\'width: 60px;height:30px;text-align: center;\'>CO</th><th style=\'width: 60px;height:30px;text-align: center;\'>NO</th><th style=\'width: 60px;height:30px;text-align: center;\'>N02</th><th style=\'width: 60px;height:30px;text-align: center;\'>NOX</th> <th style=\'width: 60px;height:30px;text-align: center;\'>O3</th> </tr><tr><td style=\'width: 60px;height:30px;text-align: center;\'>"
         + this.lastMeasuresStation.SO2 + "</td><td style=\'width: 60px;height:30px;text-align: center;\'>"
         + this.lastMeasuresStation.CO + "</td><td style=\'width: 60px;height:30px;text-align: center;\'> " 
         + this.lastMeasuresStation.NO + "</td><td style=\'width: 60px;height:30px;text-align: center;\'>" 
         + this.lastMeasuresStation.NO2 + "</td><td style=\'width: 60px;height:30px;text-align: center;\'>" 
         + this.lastMeasuresStation.NOX + "</td><td style=\'width: 60px;height:30px;text-align: center;\'>"
         + this.lastMeasuresStation.O3 + "</td></tr></table>Fuente de los datos:<a href=\'http://www.agroambient.gva.es/es/web/calidad-ambiental/datos-on-line\'> RVVCCA </a></section></main></div>";

      // Creamos el infowindow
      const infowindow = new google.maps.InfoWindow({
            content: infowindowContent
         });

     // Añadimos un esuchador para que al clickar sobre el icono se habra el infowindow
      marker.addListener('click', () => {
            infowindow.open(this.mapa, marker);
         });
      });
   }

   // ----------------------------------------------------------------
   // Pequeño hack para poder leer los datos de firebase.
   // No se como se puede leer directamete sin que de fallo
   // data: Observable<Item> FirestoreData(?) -> f() -> json
   // ----------------------------------------------------------------
   private parsearDatos(data: any) {
      const rawData = JSON.stringify(data);
      return JSON.parse(rawData);
   }
}
