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
import * as firebase from 'firebase/app';

@Injectable()
export class Firebase {
   constructor(
      private db: AngularFirestore
   ) {

   }

   /*---------------------- 
         Get requests
   -----------------------*/
   public getAllMeasures() {
      return this.db.collection('measures').valueChanges();
   }

   /*---------------------- 
         Post requests
   -----------------------*/

   // --- Login / Register  
   public registerUser(value) {
      return new Promise<any>((resolve, reject) => {
         firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
            .then(
               res => resolve(res),
               err => reject(err))
      })
   }

   public loginUser(value) {
      return new Promise<any>((resolve, reject) => {
         firebase.auth().signInWithEmailAndPassword(value.email, value.password)
            .then(
               res => resolve(res),
               err => reject(err))
      })
   }

   public logoutUser() {
      return new Promise((resolve, reject) => {
         if (firebase.auth().currentUser) {
            firebase.auth().signOut()
               .then(() => {
                  console.log("LOG Out");
                  resolve();
               }).catch((error) => {
                  reject();
               });
         }
      })
   }

   public userDetails() {
      return firebase.auth().currentUser;
   }
}