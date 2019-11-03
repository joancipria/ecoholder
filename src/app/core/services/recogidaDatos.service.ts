/*********************************************************************
@name recogidaDatos.service.ts
@description Se establece cada cuantos metros(si se ha movido) y cada cuanto tiempo(si ha estado parado) 
se actualizan las medidas y se envian al servidor.
@author Vicent Borja Roca
@date 29/10/2019
@license GPLv3
*********************************************************************/


// Librerías de angular/ionic 
import { Injectable } from "@angular/core";
import { Events } from '@ionic/angular';
import { ReceptorBLE } from "../../core/services/receptorBLE.service";
import { ServidorFake } from "../../core/services/servidorFake.service";
import { LocalizadorGPS } from "../../core/services/LocalizadorGPS.service";


@Injectable()

export class RecogidaDatos {

    private latAnterior: any;
    private lngAnterior: any;

    constructor(
        private ble: ReceptorBLE,
        private events: Events,
        private servidor: ServidorFake,
        private gps: LocalizadorGPS

    ) {}
    

     public hayQueActualizarMedicionesYEnviarlasAlServidor() {
        this.ble.actualizarMediciones().then(
            succes => {
                if (this.ble.getUltima().value != undefined) {
                    this.servidor.guardarSo2(this.ble.getUltima());
                }
            },
            error => {
                console.log("Error al actualizar mediciones")
            }
        )
    }

    public comprobarMovimiento(){

        if( this.gps.meHeMovido(this.latAnterior,this.lngAnterior) || this.latAnterior == undefined){
            
            this.hayQueActualizarMedicionesYEnviarlasAlServidor();

            this.latAnterior = this.gps.lat;
            this.lngAnterior = this.gps.lng;

        }

    }





    public alarmaEstacionamiento(){

        setInterval(function(){  }, 600000);
    }
}