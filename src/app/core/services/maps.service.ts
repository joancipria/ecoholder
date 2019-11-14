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

      // Mostramos las estaciones de medidas
      this.mostrarEstacionDeMedida();

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

    // ----------------------------------------------------------------
   // Colocar marker con la estación de medida de Gandía
   // -> f() ->
   // ----------------------------------------------------------------
   private mostrarEstacionDeMedida() {

      // Ruta al icono personalizado para las estaciones de medida
      const urlIcon = 'assets/maps/iconoEstacionMedida.png';

      // Obtención de la información de la estación de medida de Gandía
      let estacionGandia = {};
      this.firebase.obtenerEstacionDeMedida()
      .then(res => {
         estacionGandia = res;
         console.log('map service', estacionGandia);

      // Creación del objeto LatLng de Google Maps con las coordenadas de la estación
         const LocalizacionEstacion = new google.maps.LatLng(
            estacionGandia['latitud'],
            estacionGandia['longitud']
         );

      // Creación del Marker y posicionamiento sobre el mapa
         const marker = new google.maps.Marker({
            position: LocalizacionEstacion,
            map: this.mapa,
            title: 'Estación medida Gandía',
            icon: { url: urlIcon, scaledSize: new google.maps.Size(50, 50) },
         });

         const infowindowContent = "<div><header style='width:100%;height:40px;margin: 0 auto;background-color:green;padding: 5px;'><h2 style='  width:100%;margin: 0 auto;color: white;'>ESTACIÓN DE GANDIA</h2></header>" +
         "<main style='margin: 10px 0;'><section style='  display:flex; justify-content: center'>" +
         "<img  width='50%'  style='margin:10px;padding-left:5px;' src=\'http://www.cma.gva.es/cidam/emedio/atmosfera/jsp/img/ES_00005.jpg\' alt=\'estación meteorlogíca Gandía\'>" +
         "<article><br />Municipio   Gandia <br /> Provincia   VALÈNCIA <br /> Zona   Residencial <br /> Dirección   Parc Alquería Nova" +
         "<br /> Código   46131002 <br /> Longitud   0º 11 min 25 seg Oeste <br />" +
         "Latitud   38º 58 min 08 seg Norte <br /> Altitud   22 m <br /> </article></section><section style='  margin-top: 5px;width:90%;margin: 0 auto;'><h3>" +
         "ÚLTIMAS MEDIDAS<span style='  display:block;font-size: 12px;'> 11:00 AM 14/11/2019 </span></h3><table border=\'1\' style='  border-collapse:collapse;margin:10px 5px;'>" +
         "<tr><th style='width: 60px;height:30px;text-align: center;'>SO2</th><th style='width: 60px;height:30px;text-align: center;'>CO</th><th style='width: 60px;height:30px;text-align: center;'>NO</th><th style='width: 60px;height:30px;text-align: center;'>N02</th><th style='width: 60px;height:30px;text-align: center;'>NOX</th> <th style='width: 60px;height:30px;text-align: center;'>O3</th> </tr><tr><td style='width: 60px;height:30px;text-align: center;'>3</td><td style='width: 60px;height:30px;text-align: center;'>0.1</td><td style='width: 60px;height:30px;text-align: center;'>1</td>" +
         " <td style='width: 60px;height:30px;text-align: center;'>11</td><td style='width: 60px;height:30px;text-align: center;'>13</td><td style='width: 60px;height:30px;text-align: center;'>32</td></tr></table>Fuente de los datos:" +
         '<a href=\'http://www.agroambient.gva.es/es/web/calidad-ambiental/datos-on-line\'> RVVCCA </a></section></main></div>';

      // Creamos el infowindow
         const infowindow = new google.maps.InfoWindow({
            content: infowindowContent
         });

      // Añadimos un esuchador para que al clickar sobre el icono se habra el infowindow
         marker.addListener('click', () => {
            infowindow.open(this.mapa, marker);
          });

       },
         err => {
        console.log('Error al obtener información de la estación de medida de Gandía');
      });

   }


}