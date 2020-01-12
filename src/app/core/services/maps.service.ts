/*********************************************************************
@name Maps.service.ts
@description Renderiza un mapa de Google con las medidas obtenidas de la base de datos
@author Joan Ciprià Moreno Teodoro
@date 14/10/2019
@license GPLv3
*********************************************************************/

// Librerías de angular/ionic
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

// Servicios propios
// GPS
import { LocalizadorGPS } from '../../core/services/LocalizadorGPS.service';

// Firebase
import { Firebase } from '../../core/services/firebase.service';

// Helper
import { Helper } from '../../core/helper';


declare var google;

@Injectable()
export class Maps {
   public mapa: any;
   public mapaCalor: any;
   public directionsService: any;
   public directionsRenderer: any;
   public googleAutocomplete: any;
   public lastMeasuresStation: any;
   public mapMarkers = [];
   public destination: any;

   // Variables para la cuadrícula
   public rectangle: any;
   public rectangleLng = [];
   public matrizColores = [];
   public marker1: any;
   public marker2: any;

   public numCells: number;

   constructor(
      private gps: LocalizadorGPS,
      public firebase: Firebase,
      private helper: Helper,
      public platform: Platform
   ) { }

 public initPreviousMaps(mapElement) {
      // Obtener posición actual
      const posicionActual = new google.maps.LatLng(
         this.gps.lat || 38.971990,
         this.gps.lng || -0.179660
      );

      // Opciones del mapa
      let mapOptions;
      if (this.platform.is('android')) {
         // Móvil
         mapOptions = {
            center: posicionActual,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: true,
            zoomControl: false,
            fullscreenControl: false,
            streetViewControl: false
         };
      } else {
         // PC
         mapOptions = {
            center: posicionActual,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: true,
            zoomControl: true,
            zoomControlOptions: {
               position: google.maps.ControlPosition.TOP_RIGHT
            },
            fullscreenControl: false,
            streetViewControl: false
         };
      }


      // Mostramos la estación de medida de Gandía en el mapa
      this.mostrarEstacionDeMedida();
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
 }


   /**********************************************
   @description Inizializa el mapa sobre el elemento del DOM indidcado
   @author Joan Ciprià Moreno Teodoro
   @date 10/10/2019
   ***********************************************/
   public async inicializarMapa(mapElement, searchElement, panelElement, directionsButtonElement) {

      // Obtener posición actual
      const posicionActual = new google.maps.LatLng(
         this.gps.lat,
         this.gps.lng
      );

      // Opciones del mapa
      let mapOptions;
      if (this.platform.is('android')) {
         // Móvil
         mapOptions = {
            center: posicionActual,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: true,
            zoomControl: false,
            fullscreenControl: false,
            streetViewControl: false
         };
      } else {
         // PC
         mapOptions = {
            center: posicionActual,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: true,
            zoomControl: true,
            zoomControlOptions: {
               position: google.maps.ControlPosition.TOP_RIGHT
            },
            fullscreenControl: false,
            streetViewControl: false
         };
      }


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
      this.directionsRenderer.setOptions({ suppressMarkers: true });
      this.directionsRenderer.setPanel(panelElement);

      // Renderizar mapa calor
      this.renderizarMapaCalor();

      // Generamos la matriz de colores
      this.generarMatrizColores();

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
         directionsButtonElement.el.style.display = "flex"; // Mostramos botón
      });

   }

   public cambiarRadius(radius: number) {
      this.mapaCalor.set('radius', radius);

   }

   public cambiarGradiente(g: any) {
      this.mapaCalor.set('gradient', g);

   }

   /**********************************************
   @description Renderizar mapa de calor
   @author Diana
   @author Joan Ciprià Moreno Teodoro
   @date 10/10/2019
   ***********************************************/
   private renderizarMapaCalor() {
      // Callback de firebase
      this.firebase.obtenerMedidas()
         .subscribe((data: any) => {
           // console.log(data);


            // const measures = this.helper.parsearDatos(data);
            // // Datos de firebase
            //             console.log('Data from firebase', data);

            // Array datos heatmap
            const heatMapData = [];

            // Recorremos medidas
            for (let i = 0; i < data.length; i++) {
               if (!isNaN(data[i].latitude) && !isNaN(data[i].latitude)) {
                  const coords = {
                     location: new google.maps.LatLng(
                        data[i].latitude || data[i].lat,
                        data[i].longitude || data[i].long
                     ),
                     weight: data[i].value
                  }
                  // Rellenamos array heatmap con las medidas
                  heatMapData.push(coords);

               }
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
      return this.toggle(this.mapaCalor);
   }

   /**********************************************
   @description Calculamos ruta desde ubicación actual hasta destino
   @author Joan Ciprià Moreno Teodoro
   @date 10/10/2019
   ***********************************************/
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
            this.renderizarMarcadorDestino(end);
         }
      });
   }

   /**********************************************
   @description Renderiza un marcador en el mapa
   @author Joan Ciprià Moreno Teodoro
   @date 10/10/2019
   ***********************************************/
   private renderizarMarcadorDestino(sitio) {
      // Limpiar marker anterior
      if (this.mapMarkers.length > 0) {
         this.mapMarkers[0].setMap(null);
         // console.log("este", this.mapMarkers[0])
      }

      let geocoder = new google.maps.Geocoder();
      let address = sitio;
      geocoder.geocode({ 'address': address }, (results, status) => {
         if (status == google.maps.GeocoderStatus.OK) {
            // Marker destino
            let marker = new google.maps.Marker({
               position: new google.maps.LatLng(
                  results[0].geometry.location.lat(),
                  results[0].geometry.location.lng()
               ),
               map: this.mapa,
               title: sitio.split(",")[0]
            });
            this.destination = {
               lat: results[0].geometry.location.lat(),
               lng: results[0].geometry.location.lng()
            };
            this.mapMarkers.push(marker);
            marker.setMap(this.mapa);
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
         const station = this.helper.parsearDatos(res);

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
         const infowindowContent = "<div><header style=\'width:100%;height:40px;margin: 0 auto;background-color:green;padding: 5px;\'><h3 style=\'  width:100%;margin: 0 auto;color:white;\'>Gandia Station</h3></header><main style=\'margin: 10px 0;\'><section style=\'  display:flex; justify-content: center\'><img  width=\'30%\'  style=\'margin:10px;padding-left:5px;\' src=\'assets/img/estacionGandia.jpg\'><article> <br />Address: "
            + station.address + "<br /> PC:   46131002 <br /> Longitude"
            + station.longitude + " <br />Latitude: "
            + station.latitude + "<br /> Altitude:   "
            + station.altitude + " m <br /></article></section><section style=\'margin-top: 5px;width:90%;margin: 0 auto;\'><h3>Latest measures<span style=\'display:block;font-size: 12px;\'> "
            + new Date(this.lastMeasuresStation.date).toUTCString() + "</span></h3><table border=\'1\' style=\'  border-collapse:collapse;margin:10px 5px;\'><tr><th style=\'width: 60px;height:30px;text-align: center;\'>SO2</th><th style=\'width: 60px;height:30px;text-align: center;\'>CO</th><th style=\'width: 60px;height:30px;text-align: center;\'>NO</th><th style=\'width: 60px;height:30px;text-align: center;\'>N02</th><th style=\'width: 60px;height:30px;text-align: center;\'>NOX</th> <th style=\'width: 60px;height:30px;text-align: center;\'>O3</th> </tr><tr><td style=\'width: 60px;height:30px;text-align: center;\'>"
            + this.lastMeasuresStation.SO2 + "</td><td style=\'width: 60px;height:30px;text-align: center;\'>"
            + this.lastMeasuresStation.CO + "</td><td style=\'width: 60px;height:30px;text-align: center;\'> "
            + this.lastMeasuresStation.NO + "</td><td style=\'width: 60px;height:30px;text-align: center;\'>"
            + this.lastMeasuresStation.NO2 + "</td><td style=\'width: 60px;height:30px;text-align: center;\'>"
            + this.lastMeasuresStation.NOX + "</td><td style=\'width: 60px;height:30px;text-align: center;\'>"
            + this.lastMeasuresStation.O3 + "</td></tr></table>Source: <a href=\'http://www.agroambient.gva.es/es/web/calidad-ambiental/datos-on-line\'>RVVCCA</a></section></main></div>";

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
   // Generar cuadricula mediante rectángulos de Google Maps
   // -> f() ->
   // Diana Hernández Soler a partir de:
   // https://stackoverflow.com/questions/25908973/how-do-i-create-a-grid-in-google-maps-api-v3
   // ----------------------------------------------------------------
   public generarCuadricula() {
      // Obtenemos la información de la cuadricula guardada en la BBDD
      this.firebase.obtenerInfoCuadricula().subscribe((res: any) => {

         // Parseramos los datos de Firestore
         const info = this.helper.parsearDatos(res);
         // console.log('raw', res);
         // console.log('parse', info);

         // Creamos los dos marcadores del area a cuadricular
         this.marker1 = new google.maps.Marker({
            position: new google.maps.LatLng(info.PointA.split(',')[0], info.PointA.split(',')[1])
         });

         this.marker2 = new google.maps.Marker({
            position: new google.maps.LatLng(info.PointB.split(',')[0], info.PointB.split(',')[1])
         });

         // Mostramos en el mapa el polígono a cudricular
         this.rectangle = new google.maps.Rectangle({
            strokeColor: '#FFF',
            strokeOpacity: .8,
            strokeWeight: 2,
            fillColor: '#3ADF00',
            fillOpacity: 0.1,
            map: this.mapa,
            bounds: new google.maps.LatLngBounds(
               this.marker1.getPosition(),
               this.marker2.getPosition())
         });

         this.rectangleLng = [];

         // Creamos y mostramos el grid
         this.obtenerCasillas(info.rows, info.columns, true);
      });
   }

   // ----------------------------------------------------------------------------------
   // Genera las cuadriculas interiores
   // filas: number, columnas: number -> f() ->
   // Diana Hernández Soler
   // ----------------------------------------------------------------------------------
   public obtenerCasillas(filas: number, columnas: number, firsTime: boolean): void {

      // Limpiamos el array que representa la cuadrícula
      if (!firsTime) {
         // tslint:disable-next-line: forin
         for (let x in this.rectangleLng) {
            for (let y in this.rectangleLng[x]) {
               if (this.rectangleLng[x][y].setMap) {
                  this.rectangleLng[x][y].setMap(null);
                  this.rectangleLng[x][y] = null;
               }
            }
         }
      }

      const leftSideDist = this.marker2.getPosition().lng() - this.marker1.getPosition().lng();
      const belowSideDist = this.marker2.getPosition().lat() - this.marker1.getPosition().lat();

      const dividerLat = columnas;
      const dividerLng = filas;
      const excLat = belowSideDist / dividerLat;
      const excLng = leftSideDist / dividerLng;

      const m1Lat = this.marker1.getPosition().lat();
      const m1Lng = this.marker1.getPosition().lng();

      for (let i = 0; i < dividerLat; i++) {
         if (!this.rectangleLng[i]) { this.rectangleLng[i] = []; }
         for (let j = 0; j < dividerLng; j++) {
            if (!this.rectangleLng[i][j]) { this.rectangleLng[i][j] = {}; }
            this.rectangleLng[i][j] = new google.maps.Rectangle({
               strokeColor: '#FFF',
               strokeOpacity: .8,
               strokeWeight: 2,
               fillColor: this.matrizColores[i][j] || '#3ADF00',
               fillOpacity: 0.3,
               map: this.mapa,
               bounds: new google.maps.LatLngBounds(
                  new google.maps.LatLng(m1Lat + (excLat * i), m1Lng + (excLng * j)),
                  new google.maps.LatLng(m1Lat + (excLat * (i + 1)), m1Lng + (excLng * (j + 1))))
            });
         } // for j Lng
      } // for i Lat
   }

   public toggleCuadricula(): boolean {
      this.toggle(this.rectangle);

      for (let i = 0; i < 20; i++) {
         for (let j = 0; j < 20; j++) {
            this.toggle(this.rectangleLng[i][j]);
         }
      }

      return this.rectangle.getMap();
   }

   // ---------------------------------------------------------------
   // Genera una matriz del colores
   // -> f() -> void
   // Diana Hernández Soler
   // ---------------------------------------------------------------
   private generarMatrizColores(): void {

      this.firebase.obtenerUltimoMapa().subscribe(res => {
         // Parseamos los datos
         const datos = this.helper.parsearDatos(res);
         const grid = JSON.parse(datos[0].grid);
         // console.table(grid);
         this.matrizColoresByGrid(grid);
      });
   }

   // ---------------------------------------------------------------
   // Función genérica para mostrar/ocultar elementos del mapa
   // elemento -> f() -> void
   // Diana Hernández Soler
   // ---------------------------------------------------------------
   private toggle(elemento: any) {
      elemento.setMap(elemento.getMap() ? null : this.mapa);
   }

   /**********************************************
   @description pinta la cuadricula con la fecha más cerccana a date
   @design date: milliseconds -> f() -> void
   @author Diana Hernández Soler
   @date 11/01/2020
   ***********************************************/
   public getClosestDate(date: number): void {
      const datos = this.firebase.getPollutionsMap().subscribe(res => {
         const datos = this.helper.parsearDatos(res);
         const fechasPosteriores = [];
         datos.forEach( function(d) {
            if (d.date > date) {
               fechasPosteriores.push(d.date);
            }
         });
         const closest = fechasPosteriores[0];
         this.firebase.getPollutionMap(closest).subscribe((res: any) => {
            const datos = this.helper.parsearDatos(res);
            const grid = JSON.parse(datos[0].grid);
            this.numCells = grid.length * grid[0].length;
            this.matrizColoresByGrid(grid);
            this.generarMatrizColores();
            this.generarCuadricula();
         });
      });
   }

   public matrizColoresByGrid(grid: any): any {
       // Creamos una matriz nueva que en lugar de valores tendra colores
      for (let i = 0; i < grid.length; i++) {
         if (!this.matrizColores[i]) { this.matrizColores[i] = []; }
         for (let j = 0; j < grid[0].length; j++) {
            if (!this.matrizColores[i][j]) { this.matrizColores[i][j] = {}; }
            const v = grid[i][j];
            // Por defecto es verde
            this.matrizColores[i][j] = null;

            if (v > 400) {
               this.matrizColores[i][j] = '#FF0000';
            }
            if (v > 350 && v < 400) {
               this.matrizColores[i][j] = '#FF8000';
            }
            if (v < 350 && v > 300) {
               this.matrizColores[i][j] = '#D7DF01';
            }
         }
      }
   }

   public getNumberMeasures(): number {
      return this.numCells;
   }
}
