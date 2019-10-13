import { Injectable } from "@angular/core";
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable()
export class ServidorFake {
   constructor(
      private http: HttpClient
   ) {

   }

   guardarSo2(so2) {
      let body = new HttpParams()
         .set('value', so2.value)
         .set('date', so2.date)
         .set('latitude', so2.latitude)
         .set('longitude', so2.longitude)

      this.http.post('http://192.168.43.141:3000/api/measure', body)
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