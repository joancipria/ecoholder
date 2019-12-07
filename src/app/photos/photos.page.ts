/*********************************************************************
@name photos.page.ts
@description Lógica correspondiente a la vista "Photos" 
@author Joan Ciprià Moreno Teodoro
@date 10/09/2019
@license GPLv3
*********************************************************************/

import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


// Tutorial
import { NavController, ModalController } from '@ionic/angular';
import * as introJs from 'intro.js/intro.js';
import { Firebase } from '../core/services/firebase.service';
import { LocalStorage } from '../core/services/localStorage.service';
import { Helper } from '../core/helper';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.page.html',
  styleUrls: ['./photos.page.scss'],
})
export class PhotosPage implements OnInit {

  foto: any = "https://amateuraccounts.files.wordpress.com/2011/07/img_8199.jpg";

  constructor(
    private camera: Camera,
    private navCtrl: NavController,
    private storage: LocalStorage,
    private firebase: Firebase
  ) { }

  ngOnInit() {


    // Raquel. Comprobar primera vez del usuario
    const uid = this.firebase.informacionUsuario().uid;
    this.storage.get(uid).then((val: any) => {
      if (val !== 'si') {

        // Se inicia el tutorial
        introJs().start().oncomplete(() => {
          this.navCtrl.navigateForward('/app/tabs/settings?multi-page=true');
        });
      }
    });
  }

  hacerFoto() {
    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL
    }
    this.camera.getPicture(options).then((imageData) => {
      this.foto = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
    });
  }
}
