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
import { Storage } from '@ionic/storage';

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
    private storage: Storage
  ) { }

  ngOnInit() {


    // Raquel. Se utiliza el storage para saber si es la primera vez que entra el usuario.
    this.storage.get('first_time').then((val) => {
      if (val == null){
        console.log('Es la primera vez');
        this.storage.set('first_time', 'done');

        //Aqui se inicia el tutorial
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
