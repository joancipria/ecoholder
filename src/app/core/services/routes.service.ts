/**********************************************************************************
@name routes.service.ts
@description Servicio para controlar las rutas que realiza el usuario
@author Joan CIprià Moreno Teodoro
@date 04/12/2019
@license GPLv3
***********************************************************************************/

import { Injectable } from '@angular/core';

// --- Servicios propios ---
// Gps
import { LocalizadorGPS } from '../../core/services/LocalizadorGPS.service';

// Firebase
import { Firebase } from '../../core/services/firebase.service';



@Injectable()
export class Routes {
    // ID de la ruta (devuelto por el documento de Firebase)
    private idRutaActual: any;

    // Array donde se guardan los waypoinys (puntos intermedios de la ruta)
    private waypoints = [];

    // Intervalo del timer registrarWayPoint()
    private waypointsInterval = 10000; // 10 segundos

    constructor(
        private firebase: Firebase,
        private gps: LocalizadorGPS,
    ) {

    }

    /**********************************************
    @description Inicia una ruta nueva. Obtiene el 
    punto de inicio de la ruta y lo guarda en la BBDD
    @author Joan Ciprià Moreno Teodoro
    @date 09/12/2019
    ***********************************************/
    public async empezarRuta() {
        // Limpiamos lista de waypoints
        this.waypoints = [];
        
        // Obtenemos punto de inicio
        let posicionInicio = {
            lat: this.gps.lat,
            lng: this.gps.lng
        };

        // Creamos una nueva ruta y guardamos su ID
        this.idRutaActual = await this.firebase.empezarRuta(posicionInicio);

        // Programamos un timer para que recoja waypoints cada X segundos
        setInterval(() => { this.registrarWaypoint() }, this.waypointsInterval);
    }

    /**********************************************
    @description Finaliza la ruta actual. Obtiene
    el punto final de la ruta y lo guarda en la BDD
    junto con los waypoints
    @author Joan Ciprià Moreno Teodoro
    @date 09/12/2019
    ***********************************************/
    public finalizarRuta() {
        // Obtenemos punto final
        let posicionFinal = {
            lat: this.gps.lat,
            lng: this.gps.lng
        };
        // Finalizamos la ruta añadiendo a la ruta activa la posición final y los waypoints
        this.firebase.finalizarRuta(this.idRutaActual, posicionFinal, this.waypoints);
    }

    /**********************************************
    @description Obtiene la posición actual y la guarda
    en el array de waypoints
    @author Joan Ciprià Moreno Teodoro
    @date 09/12/2019
    ***********************************************/
    public registrarWaypoint() {
        // Posición actual
        let waypoint = {
            lat: this.gps.lat,
            lng: this.gps.lng
        };

        // Guardamos posición actual
        this.waypoints.push(waypoint);
    }
}
