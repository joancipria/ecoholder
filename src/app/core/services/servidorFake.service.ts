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
   private serverURL: string = 'https://diaherso.upv.edu.es/';
   private measuresURL: string = 'api/measure';
   private usersURL: string = 'api/users';

   constructor(
      private http: HttpClient
   ) {

   }

   // Guardar medida de Azufre
   public guardarSo2(so2) {
      // Crear el body de la petición
      let body = new HttpParams()
         .set('value', so2.value)
         .set('date', so2.date)
         .set('latitude', so2.latitude)
         .set('longitude', so2.longitude)

      // Enviar al servidor
      this.enviarPeticionPost(body, this.measuresURL);
   }

   // Guardar medida de Azufre
   public guardarDatosUsuario(datos) {
      // Crear el body de la petición
      let body = new HttpParams()
         .set('uuid', datos.uuid)
         .set('name', datos.name)
         .set('telephone', datos.telephone)

      // Enviar al servidor
      this.enviarPeticionPost(body, this.usersURL);
   }

   // Enviar peticiones POST
   private enviarPeticionPost(body, url) {
      this.http.post(this.serverURL + url, body)
         .subscribe(
            res => {
               console.log(res);
            },
            err => {
               if (err.status != 200) { // En caso de error, mostrar por consola
                  console.log("Error occured", err);
               }
            }
         );
   }
}