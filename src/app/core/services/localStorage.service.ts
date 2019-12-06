/**********************************************************************************
@name localStorage.service.ts
@description Servicio para guardar/recuperar variables guardadas en el Local Storage del navegador
@author Diana Hernández Soler
@date 04/12/2019
@license GPLv3
***********************************************************************************/

import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable()
export class LocalStorage {
    constructor(
        private platform: Platform,
        private storage: Storage
    ) { }

    /**********************************************************************************
    @description Devuelve el valor de una variable guardada en el Local Storage a partir de su clave
    @design key: string -> f() -> val: string
    @author Diana Hernández Soler
    @date 04/12/2019
    **********************************************************************************/
    public get(key: string) {
        return new Promise((valor) => {
            this.storage.get(key).then((_valor: string) => {
                console.log('Desde servicio LocalStorage se ha recuperado la variable: ' + key);
                valor(_valor);
            });
        });
    }

    /*********************************************************************************
    @description Guarda en el Local Storage una variable con los datos pasados {key: value}
    @design key: string, val: string -> f() -> void
    @author Diana Hernández Soler
    @date 04/12/2019
    *********************************************************************************/
    public set(key: string, val: string): void {
        this.platform.ready().then(() => {
            console.log('Desde Servicio LocalStorage se ha guardado: ' + key + ':' + val);
            this.storage.set(key, val);
        });
    }
}