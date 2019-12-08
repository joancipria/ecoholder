/**********************************************************************************
@name routes.service.ts
@description Servicio para controlar las rutas 
@author Joan CIprià Moreno Teodoro
@date 04/12/2019
@license GPLv3
***********************************************************************************/

import { Injectable } from '@angular/core';

// GPS
import { LocalizadorGPS } from '../../core/services/LocalizadorGPS.service';

// Firebase
import { Firebase } from '../../core/services/firebase.service';



@Injectable()
export class Routes {
    private idRutaActual: any;

    constructor(
        private firebase: Firebase,
        private gps: LocalizadorGPS,
    ) { 

    }

    public async empezarRuta(){
        let posicionInicio = {
            lat: this.gps.lat,
            lng: this.gps.lng
        };

        this.idRutaActual = await this.firebase.empezarRuta(posicionInicio);
    }

    public finalizarRuta(){
        let posicionFinal = {
            lat: this.gps.lat,
            lng: this.gps.lng
        };

        this.firebase.finalizarRuta(this.idRutaActual,posicionFinal);
    }
}
