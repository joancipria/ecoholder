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
    constructor() { 

    }

    public empezarRuta(){
        console.log("Has empezado una ruta")
    }

    public finalizarRuta(){
        
    }
}