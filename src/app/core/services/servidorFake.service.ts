/*********************************************************************
@name ServidorFake.service.ts
@description Lógica 'falsa' del servidor, realiza peticiones GET/POST/PUT
a la API REST del servidor 
@author Joan Ciprià Moreno Teodoro
@date 08/10/2019
@license GPLv3
*********************************************************************/

// Librerías de angular/ionic 
import { Injectable } from "@angular/core";

// Librería de angular para realizar peticiones
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable()
export class ServidorFake {
   // URL del servidor
   serverURL: string = 'http://192.168.43.141:3000/api/measure';

   constructor(
      private http: HttpClient
   ) {

   }

   // Guardar medida de Azufre
   guardarSo2(so2) {

      // Crear el body de la petición
      let body = new HttpParams()
         .set('value', so2.value)
         .set('date', so2.date)
         .set('latitude', so2.latitude)
         .set('longitude', so2.longitude)

      // Enviar al servidor
      this.http.post(this.serverURL, body)
         .subscribe(
            res => {
               console.log(res);
            },
            err => {
               if (err.status != 200) { // En caso de error, mostrar por consola
                  console.log("Error occured",err);
               }
            }
         );
   }
}