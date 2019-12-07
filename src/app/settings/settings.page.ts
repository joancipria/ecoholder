/*********************************************************************
@name settings.page.ts
@description Lógica correspondiente a la vista "Settings" 
@author Joan Ciprià Moreno Teodoro
@date 10/09/2019
@license GPLv3
*********************************************************************/

// Librerías de angular/ionic
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { NgZone } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Helper } from '../core/helper';

// Firebase 
import { Firebase } from '../core/services/firebase.service';

// Beacon
import { Beacon } from '../core/services/beacon.service';

//tutorial
import { ModalController } from '@ionic/angular';
import * as introJs from 'intro.js/intro.js';
import { LocalStorage } from '../core/services/localStorage.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  userEmail: string;
  userUuid: string;
  devices: any[] = [];
  newDevices: any[] = [];
  constructor(
    private navCtrl: NavController,
    private firebase: Firebase,
    private alertCtrl: AlertController,
    private beacon: Beacon,
    private ngZone: NgZone,
    private loading: LoadingController,
    private storage: LocalStorage,
    private helper: Helper
  ) { }

  ngOnInit() {
    if (this.firebase.informacionUsuario()) {
      const user = this.firebase.informacionUsuario();
      this.userEmail = user.email;

      // Mostramos los dispositivos vinculados
      this.mostrarDispositivosVinculados();
      this.newDevices = [];
    }

    //Raquel. Comprobar primera vez del usuario
    const uid = this.firebase.informacionUsuario().uid;
    this.storage.get(uid).then((val: any) => {
      if (val !== 'si') {

        // Se inicia el tutorial
        introJs().start().oncomplete(() => {
          this.navCtrl.navigateForward('/app/tabs/home?multi-page=true');
        });
      }
    });
  }

  /**********************************************
  @description Cerrar sesión
  @author Joan Ciprià Moreno Teodoro
  @date 27/10/2019
  ***********************************************/
  logout() {
    this.firebase.logout()
      .then(res => {
        console.log(res);
        this.navCtrl.navigateBack('');
      })
      .catch(error => {
        console.log(error);
      })
  }

  // -------------------------------------------------------------------
  // Mostramos los dispositivos vinculados con el usuario logueado
  // uuid: string -> f() ->
  // -------------------------------------------------------------------
  mostrarDispositivosVinculados() {
    this.firebase.obtenerDevices().subscribe(res => {
      this.devices = res;
    });
  }


  eliminarDispositivo(index: string) {
    const id = this.firebase.informacionUsuario().uid;
    const alert = this.alertCtrl.create({
      message: 'Esta acción no se puede deshacer',
      subHeader: '¿Está seguro que quiere eliminar el dispositivo ' + this.devices[index].alias + '?',
      buttons: [
        { text: 'SI', handler: () => this.firebase.eliminarDispositivo(id) },
        { text: 'NO', role: 'cancel', handler: () => console.log('Ha pulsado NO') }
      ]
    }).then(alert => {
      alert.present();
    });

  }

  // ----------------------------------------------------------------
  // Función que se encarga de presentar la ventana de carga,
  // la función recibe un numero como convenio para diferenciar 
  // que tipo de ventana se representa:
  //  1 --> Buscando dispositivos  2 --> Sincronizar con el dispositvo + mensaje
  //                tipoCarga -> f() -> 
  //
  //                  Vicent Borja Roca    
  // ----------------------------------------------------------------

  async presentLoading(tipoCarga: any) {

    if (tipoCarga == 1) {
      let cargando = await this.loading.create({
        message: 'Buscando...',
        duration: 2000
      });
      await cargando.present();

      const { role, data } = await cargando.onDidDismiss();
    }
    if (tipoCarga == 2) {
      let cargando = await this.loading.create({
        message: 'Sincronizando...',
        duration: 3000
      });
      await cargando.present();

      const { role, data } = await cargando.onDidDismiss();

      const alert = this.alertCtrl.create({
        message: "Dispositivo sincronizado satisfactoriamente",
        buttons: [
          { text: 'Confirmar', role: 'cancel', handler: () => console.log('sincronizado') }
        ]
      }).then(alert => {
        alert.present();
      });

    }
    console.log('Loading dismissed!');
  }

  // ----------------------------------------------------------------
  // Llama a escanearDispositivos() y guarda los dispositivos escaneados
  //    en la lista newDevices()
  //                 -> f() -> 
  //
  //                  Vicent Borja Roca
  // ----------------------------------------------------------------

  async buscarYMostrarDispositivos() {

    this.newDevices = [];
    this.presentLoading(1);
    await this.beacon.escanearDispositivos();
    this.newDevices = this.beacon.newDevices;
    console.log(this.newDevices);

  }

  // -----------------------------------------------------------------------------
  //  Guardo un dispositivo en la bbdd cuando el usuario lo elige de la lista
  //  de dispositivos detectados de la interfaz.
  //  
  //    index:string(la 'key' que identifica el dispositivo) -> f() -> 
  //
  //               Vicent Borja Roca
  // ------------------------------------------------------------------------------

  darDeAlta(index: string) {

    const id = this.newDevices[index].id;

    console.log("dar de alta a: " + id);

    this.presentLoading(2);

    this.ngZone.run(() => {
      this.firebase.guardarDispositivo(this.newDevices[index]);
    })

  }

}
