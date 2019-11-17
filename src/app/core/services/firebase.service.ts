/*********************************************************************
@name Firebase.service.ts
@description Lógica para leer la BD de firebase
@author Joan Ciprià Moreno Teodoro
@date 13/10/2019
@license GPLv3
*********************************************************************/

// Librerías de angular/ionic
import { Injectable } from '@angular/core';

// Lógica false del servidor
import { ServidorFake } from '../../core/services/servidorFake.service';

// Firebase
import { AngularFirestore, validateEventsArray } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable()
export class Firebase {
   constructor(
      private db: AngularFirestore,
      private servidor: ServidorFake,
   ) {

   }

   /*----------------------
         Peticiones GET
   -----------------------*/

   // Obtener toda la colección "measures"
   public obtenerMedidas() {
      return this.db.collection('measures').valueChanges();
   }

   /*----------------------
         Firebase AUTH
   -----------------------*/

   // Registrar usuario
   public registrarUsuario(value) {
      return new Promise<any>((resolve, reject) => {
         // Registrar usuario utilizando Firebase Auth
         firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
            .then(
               // Si el registro se ha completado con éxio, guardar la información del usuario
               res => {
                  const userData = {
                     uuid: firebase.auth().currentUser.uid,
                     name: value.name,
                     telephone: value.telephone
                  };
                  // Enviar al servidor
                  this.servidor.guardarDatosUsuario(userData);
                  resolve(res);
               },
               err => reject(err));
      });
   }

   // Login / Iniciar sesión
   public login(value) {
      return new Promise<any>((resolve, reject) => {
         firebase.auth().signInWithEmailAndPassword(value.email, value.password)
            .then(
               res => resolve(res),
               err => reject(err));
      });
   }

   // Logout / Cerrar sesión
   public logout() {
      return new Promise((resolve, reject) => {
         if (firebase.auth().currentUser) {
            firebase.auth().signOut()
               .then(() => {
                  console.log('User logged out');
                  resolve();
               }).catch((error) => {
                  reject();
               });
         }
      });
   }

   // Obtener información usuario
   public informacionUsuario() {
      return firebase.auth().currentUser;
   }

   // -------------------------------------------
   // Obtención de la información de la estación de medición en Gandía
   // -> f() -> {codigo: string, direccion: string, latitud: float; longitud: float [ ...+ info ] }
   // Diana Hernández Soler
   // -------------------------------------------
   public obtenerEstacionDeMedida() {
      return this.db.collection('stations').doc('46131002').valueChanges();
   }

   // -------------------------------------------
   // Obtención del útlimo (por fecha) grupo de medidas de la estación de Gandía
   // -> f() -> { date: string, S02: number, NO: number, NOX: number, C02: number, 03: number }
   // Diana Hernández Soler
   // -------------------------------------------
   public obtenerUltimasMedidasEstacionOfical() {
      const measuresRef = this.db.doc('stations/46131002');
      return measuresRef.collection('measures', ref => ref.orderBy('date', 'desc').limit(1)).valueChanges();
   }

   // -----------------------------------------------------
   // Muestra los dispositivos vinculados con el usuario logueado
   // uuid: string -> f() -> dispostivo: { id: string, alias: string, date: number }
   // Diana Hernández Soler
   // -----------------------------------------------------
   public obtenerDevices(uuid: string) {
      const measuresRef = this.db.doc('users/' + uuid);
      return measuresRef.collection('devices').valueChanges();
   }

}
