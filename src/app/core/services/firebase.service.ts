/*********************************************************************
@name Firebase.service.ts
@description Lógica para leer la BD de firebase
@author Joan Ciprià Moreno Teodoro
@date 13/10/2019
@license GPLv3
*********************************************************************/

// Librerías de angular/ionic
import { Injectable } from "@angular/core";

// Lógica false del servidor
import { ServidorFake } from "../../core/services/servidorFake.service";

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

   // Obtener toda la colección "medidas"
   public obtenerMedidasMapaCalor() {

   let data: any;
   data = this.db.doc('medidas/11-4-2019').collection('measures').valueChanges();
   return data;
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
                  let userData = {
                     uuid: firebase.auth().currentUser.uid,
                     name: value.name,
                     telephone: value.telephone
                  };
                  // Enviar al servidor
                  this.servidor.guardarDatosUsuario(userData);
                  resolve(res)
               },
               err => reject(err))
      })
   }

   // Login / Iniciar sesión
   public login(value) {
      return new Promise<any>((resolve, reject) => {
         firebase.auth().signInWithEmailAndPassword(value.email, value.password)
            .then(
               res => resolve(res),
               err => reject(err))
      })
   }

   // Logout / Cerrar sesión
   public logout() {
      return new Promise((resolve, reject) => {
         if (firebase.auth().currentUser) {
            firebase.auth().signOut()
               .then(() => {
                  console.log("User logged out");
                  resolve();
               }).catch((error) => {
                  reject();
               });
         }
      })
   }

   // Obtener información usuario
   public informacionUsuario() {
      return firebase.auth().currentUser;
   }

   // -------------------------------------------
   // Obtención de la información de la estación de medición en Gandía
   // -> f() -> {codigo: string, direccion: string, latitud: float; longitud: float [ ...+ info ] }
   // -------------------------------------------
   public obtenerEstacionDeMedida() {

      return new Promise<any>((resolve, reject) => {

         let estacionGandia = {};
         estacionGandia = {
           codigo : '46131002',
           Direccion : 'Parc Alquería Nova',
           ciudad : 'gandia',
           provincia : 'valencia',
           latitud :  '38.9688889',
           longitud : '-0.1902778',
           estado : true,
           altutud : '22', // EN METROS
           longitudGrados : '0º 11\' 25\'\' Oeste',
           latitudGrados : '38º 58\' 08\'\' Norte',
           contaminantes : [
              'Arsénico',
              'Benzo(a)pireno',
              'Cadmio',
              'Dióxido de Azufre',
              'Dióxido de Nitrógeno',
              'Monóxido de Carbono',
              'Monóxido de Nitrógeno',
              'Níquel',
              'Oxidos de Nitrógeno totales',
              'Ozono',
              'Partículas en Suspensión (< 10 µm)',
              'Partículas en Suspensión (< 2,5 µm)',
              'Partículas en suspensión totales',
              'Plomo'
           ]
        };
         console.log('firebase service', estacionGandia);
         resolve(estacionGandia);
      });
   }




}