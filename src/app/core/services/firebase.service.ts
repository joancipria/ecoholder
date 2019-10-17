/*********************************************************************
@name Firebase.service.ts
@description Lógica para leer la BD de firebase
@author Joan Ciprià Moreno Teodoro
@date 13/10/2019
@license GPLv3
*********************************************************************/

// Librerías de angular/ionic
import { Injectable } from "@angular/core";

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class Firebase {
   constructor(
    private db: AngularFirestore
   ) {

   }

   public getAllMeasures(){
        return this.db.collection('measures').valueChanges();
   }
}