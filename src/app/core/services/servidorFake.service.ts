import { Injectable } from "@angular/core";
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable()
export class ServidorFake {
   constructor(
      private http: HttpClient
   ) {

   }

   guardarSo2(so2) {
      let payload = new HttpParams()
         .set('value', so2);

      this.http.post('http://192.168.43.141:3000/api/measure', payload)
         .subscribe(
            res => {
               console.log(res);
            },
            err => {
               if (err){
                  console.log("Error occured"+err);
               }
            }
         );
   }
}