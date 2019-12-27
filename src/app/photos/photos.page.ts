/*********************************************************************
@name photos.page.ts
@description Lógica correspondiente a la vista "Photos" 
@author Joan Ciprià Moreno Teodoro
@date 10/09/2019
@license GPLv3
*********************************************************************/

import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { HttpClientModule } from '@angular/common/http';


// Tutorial
import { NavController, ModalController } from '@ionic/angular';
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
    private helper: Helper,
    private http: HttpClientModule
  ) { }

  ngOnInit() {
    // Raquel. Mostrar tutorial si es la primera vez
    this.helper.MostrarTutorial(this.navCtrl, 'settings', false);
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
