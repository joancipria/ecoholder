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
   private uuid: string;
   public role: Number = 1;

   constructor(
      private db: AngularFirestore,
      private servidor: ServidorFake,
   ) {
   }

   /*----------------------
         Peticiones GET
   -----------------------*/

   /**********************************************
   @description Obtener toda la colección "measures"
   @author Joan Ciprià Moreno Teodoro
   @date 10/10/2019
   ***********************************************/
   public obtenerMedidas() {
      return this.db.collection('measures').valueChanges();
   }

   /*----------------------
         Firebase AUTH
   -----------------------*/

   /**********************************************
   @description Registrar usuario (Firebase Auth)
   @author Joan Ciprià Moreno Teodoro
   @date 10/10/2019
   ***********************************************/
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


   /**********************************************
   @description Obtener el rol
   @author Joan Ciprià Moreno Teodoro
   @date 26/12/2019
   ***********************************************/
   public getRole() {
      return new Promise<any>((resolve, reject) => {
         const userRef = this.db.doc('users/' + this.uuid);
         let getDoc = userRef.get()
            .toPromise()
            .then(doc => {
               if (!doc.exists) {
                  console.log('No such document!');
               } else {
                  console.log('Document data:', doc.data());
                  this.role = doc.data().role;
                  resolve(this.role);
               }
            })
            .catch(err => {
               console.log('Error getting document', err);
            });
      });
   }


   /**********************************************
   @description Obtener todos los nodos 
   @author Joan Ciprià Moreno Teodoro
   @date 12/01/2020
   ***********************************************/
   public getNodes() {
      if (this.role > 1) {
         return new Promise<any>((resolve, reject) => {
            let usersRef = this.db.collection('users');

            let allUsers = usersRef.get()
               .toPromise()
               .then(snapshot => {
                  let nodes = [];
                  snapshot.forEach(doc => {
                     //console.log(doc.id, '=>', doc.data());
                     let devicesRef = doc.ref.collection('devices');

                     let allDevices = devicesRef.get()
                     .then(snapshot => {
                        snapshot.forEach(doc => {
                           //console.log("DEV: "+doc.data());
                           nodes.push(doc.data());
                        });
                     })
                  });
                  return nodes;
               })
               .then(nodes=>{
                  console.log(nodes)
                  resolve(nodes);
               })
               .catch(err => {
                  console.log('Error getting documents', err);
               });
         });
      } else {
         console.log("Permission denied")
      }
   }

   /**********************************************
   @description Obtener todos los usuarios
   @author Joan Ciprià Moreno Teodoro
   @date 12/01/2020
   ***********************************************/
   public getAllusers() {
      if (this.role > 1) {
         return new Promise<any>((resolve, reject) => {
            let usersRef = this.db.collection('users');

            let allUsers = usersRef.get()
               .toPromise()
               .then(snapshot => {
                  let users = [];
                  snapshot.forEach(doc => {
                     //console.log(doc.id, '=>', doc.data());
                     users.push(doc.data());
                  });
                  resolve(users);
               })
               .catch(err => {
                  console.log('Error getting documents', err);
               });
         });
      } else {
         console.log("Permission denied")
      }
   }

   /**********************************************
   @description Login / Iniciar sesión (Firebase Auth)
   @author Joan Ciprià Moreno Teodoro
   @date 10/10/2019
   ***********************************************/
   public login(value) {
      return new Promise<any>((resolve, reject) => {
         firebase.auth().signInWithEmailAndPassword(value.email, value.password)
            .then(
               res => {
                  this.uuid = this.informacionUsuario().uid;
                  this.getRole();
                  resolve(res);
               },
               err => reject(err));
      });
   }

   /**********************************************
   @description Logout / Cerrar sesión (Firebase Auth)
   @author Joan Ciprià Moreno Teodoro
   @date 10/10/2019
   ***********************************************/
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
   public obtenerDevices() {
      this.uuid = this.informacionUsuario().uid;
      const measuresRef = this.db.doc('users/' + this.uuid);
      return measuresRef.collection('devices').valueChanges();
   }

   /**********************************************
    @description Obtener todos los dispositivos del usuario
    @author Joan Ciprià Moreno Teodoro
    @date 27/11/2019
    ***********************************************/
   public getDevices() {
      let devices = [];
      return new Promise((resolve, reject) => {
         this.db.doc('users/' + this.uuid).collection('devices').get()
            .toPromise()
            .then(snapshot => {
               snapshot.forEach(doc => {
                  devices.push(doc.data());
               });
               return resolve(devices);
            })
            .catch(err => {
               console.log('Error getting documents', err);
            });
      });
   }

   /**********************************************
   @description Leer de la base de datos los nodos que están en mal estado
   @author Raquel Perpiñá Clérigues
   @date 12/01/2020
   ***********************************************/
   public estadoNodo() {
      return new Promise<any>((resolve, reject) => {
         const snapshot = this.db.doc('users/' + this.uuid).collection('devices').get()
            .toPromise()
            .then((snapshot) => {
               let nodos = [];
               snapshot.forEach(doc => {
                  let device = doc.data();

                  if (device.estado == false) {
                     nodos.push(device.id);
                  }
               });
               resolve(nodos);
            })
      });
   }

   // -----------------------------------------------------
   // Elimina el dispostivo con el id dado del usuario logueado
   // uuid: string, id: string -> f() -> void
   // Diana Hernández Soler
   // -----------------------------------------------------
   public eliminarDispositivo(id: string) {
      this.uuid = this.informacionUsuario().uid;
      const measuresRef = this.db.doc('users/' + this.uuid);
      measuresRef.collection('devices').doc(id).delete();
   }

   // -----------------------------------------------------
   // Obtiene información sobre la cuadricula
   //  -> f() -> {city, PointA, PointB, rows, columns, date}
   // Diana Hernández Soler
   // -----------------------------------------------------
   public obtenerInfoCuadricula() {
      return this.db.doc('gridMaps/IQ8yXEdYnouVPbNZvCEc').valueChanges();
   }

   // -----------------------------------------------------
   // Obtiene información del último mapa generado
   //  -> f() -> {date: string, arrayValores: []}
   // Diana Hernández Soler
   // -----------------------------------------------------
   public obtenerUltimoMapa() {
      return this.db.collection('maps', ref => ref.orderBy('date', 'desc').limit(1)).valueChanges();
   }

   // // -----------------------------------------------------
   // // Guarda información de la cuadrícula
   // //  {city, PointA, PointB, rows, columns, date} -> f() ->
   // // Diana Hernández Soler
   // // -----------------------------------------------------
   // public guardarInfoCuadricula(datos: any) {
   //   this.servidor.guardarInfoCuadricula(datos);
   // }

   /**********************************************************************************
    @description Devuelve info (nombre y teléfono) del usuario logueado
    @design  -> f() -> {name: string, phone: number}
    @author Diana Hernández Soler
    @date 04/12/2019
    **********************************************************************************/
   public getInfoCurrentUser() {
      return this.db.doc('users/' + this.uuid).valueChanges();
   }


   public guardarDispositivo(dispositivo: any) {
      const ref = this.db.doc('users/' + this.uuid);
      ref.collection('devices').doc(dispositivo.id).set({
         alias: dispositivo.name,
         date: Date.now(),
         id: dispositivo.id
      });

   }

   /**********************************************
    @description Guarda en la BBD el punto de inicio
    y la hora
    @author Joan Ciprià Moreno Teodoro
    @date 09/12/2019
    ***********************************************/
   public empezarRuta(posicionInicio: any) {
      // Documento del usuario
      const ref = this.db.doc('users/' + this.uuid);


      return new Promise((resolve, reject) => {
         ref.collection('routes').add({
            startTime: +new Date(), // Timestamp de ahora
            startPoint: JSON.stringify(posicionInicio), // {lat, lng}
         }).then(ref => {
            console.log('Added document with ID: ', ref.id);
            return resolve(ref.id);
         });
      });
   }

   /**********************************************
    @description Guarda en la BBD el punto final,
    la hora y el conjunto de waypoints de la ruta
    especificada
    @author Joan Ciprià Moreno Teodoro
    @date 09/12/2019
    ***********************************************/
   public finalizarRuta(routeId: any, posicionFinal: any, waypoints: any) {
      // Documento del usuario
      const ref = this.db.doc('users/' + this.uuid + '/routes/' + routeId.toString());

      return new Promise((resolve, reject) => {
         ref.set({
            finishTime: +new Date(), // Timestamp de ahora
            finishPoint: JSON.stringify(posicionFinal),  // {lat, lng}
            waypoints: JSON.stringify(waypoints)  // [{lat, lng}]
         }, { merge: true }) // No sobreescribir documento
      });
   }


   /**********************************************
   @description Guarda en la BDD un destino favorito
   con un alias
   @author Joan Ciprià Moreno Teodoro
   @date 09/12/2019
   ***********************************************/
   public agregarRutaAfavoritas(destination: any, alias: String) {
      // Documento del usuario
      const ref = this.db.doc('users/' + this.uuid);

      return new Promise((resolve, reject) => {
         ref.collection('favDestinations').add({
            alias: alias,
            destinationPoint: JSON.stringify(destination), // {lat, lng}
         }).then(ref => {
            console.log('Added document with ID: ', ref.id);
            return resolve(ref.id);
         });
      });
   }

}
