import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


// Tutorial
import { NavController, ModalController } from '@ionic/angular';
import * as introJs from 'intro.js/intro.js';

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
    
  ) { }

  ngOnInit() {

    // Raquel. Aqui se inicia el tutorial
    introJs().start().oncomplete(() => {
      this.navCtrl.navigateForward('/app/tabs/settings?multi-page=true');
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
