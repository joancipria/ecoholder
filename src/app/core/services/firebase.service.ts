import { Injectable } from "@angular/core";

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class Firebase {
   constructor(
    public db: AngularFirestore
   ) {

   }

   getAllMeasures(){
        return this.db.collection('measures').snapshotChanges();
   }
}