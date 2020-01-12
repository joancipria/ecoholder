/*********************************************************************
@name photos.page.ts
@description Lógica correspondiente a la vista "Photos" 
@author Joan Ciprià Moreno Teodoro
@date 10/09/2019
@license GPLv3
*********************************************************************/

import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { HttpClient } from '@angular/common/http';

// Tutorial
import { NavController, ModalController } from '@ionic/angular';
import { Helper } from '../core/helper';

import { AngularFireStorageModule } from '@angular/fire/storage';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.page.html',
  styleUrls: ['./photos.page.scss'],
})
export class PhotosPage implements OnInit {

  foto: any = "https://amateuraccounts.files.wordpress.com/2011/07/img_8199.jpg";
  fotos: any[] = [];
  selectedFile: File = null;
  constructor(
    private camera: Camera,
    private navCtrl: NavController,
    private helper: Helper,
    private http: HttpClient,
    private store: AngularFireStorageModule
    //private file: File
  ) { }

  
  ngOnInit() {
    // Raquel. Mostrar tutorial si es la primera vez
    //this.helper.MostrarTutorial(this.navCtrl, 'settings', false);
  }

  onFileSelected(event){

    this.selectedFile = <File>event.target.files[0];

  }
  onUpload(){
    const fd= new FormData();

    //enviar al servidor express
    fd.append('Image', this.selectedFile, this.selectedFile.name);
    this.http.post('http://localhost:3000/api/images', fd)
    .subscribe(res=>{
      console.log(res);
    });

    const id = Math.random().toString(36).substring(2);
    const file = 
    //enviar a firestorage

    

  }
hacerFoto() {
  const options: CameraOptions = {
    destinationType: this.camera.DestinationType.DATA_URL
  }
  this.camera.getPicture(options).then((imageData) => {
    this.fotos.push('data:image/jpeg;base64,' + imageData);
  }, (err) => {
    console.log(err);
  });
}
}
