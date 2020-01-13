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
//import { File } from '@ionic-native/File/ngx';



// Tutorial
import { NavController, ModalController, AlertController } from '@ionic/angular';  
import { Helper } from '../core/helper';

import { AngularFireStorage } from '@angular/fire/storage';
import { Firebase } from '../core/services/firebase.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-photos',
  templateUrl: './photos.page.html',
  styleUrls: ['./photos.page.scss'],
})
export class PhotosPage implements OnInit {

  foto: any = "https://amateuraccounts.files.wordpress.com/2011/07/img_8199.jpg";
  fotos: any[] = [];
  UploadedFileURL: Observable<string>;
  selectedFile: File = null;
  public sideMenu: boolean = false;
  constructor(
    private camera: Camera,
    private navCtrl: NavController,
    private helper: Helper,
    private http: HttpClient,
    private store: AngularFireStorage,
    private firebase: Firebase,
    private alertControl: AlertController
    //private file: File
  ) { }

  
  ngOnInit() {
    this.sideMenu = this.helper.comprobarRol();
    // Raquel. Mostrar tutorial si es la primera vez
    //this.helper.MostrarTutorial(this.navCtrl, 'settings', false);
  }



  onFileSelected(fichero){

    this.selectedFile = <File>fichero.target.files[0];

  }

  getFoto(){

   
    var storage = new Storage();
    const filePath = this.firebase.informacionUsuario().uid + '/' + this.selectedFile.name ;
    const ref = this.store.ref(filePath);
    this.UploadedFileURL = ref.getDownloadURL();
    this.foto = this.UploadedFileURL;

  }

  onUpload(){
    const fd= new FormData();
    //enviar al servidor express
    fd.append('Image', this.selectedFile, this.selectedFile.name);
    this.http.post('http://localhost:3000/api/images', fd)
    .subscribe(res=>{
      console.log(res);
    });

    //enviar a firestorage
    const id = Math.random().toString(36).substring(2);
    const file = this.selectedFile;
    const filePath = this.firebase.informacionUsuario().uid + '/' + this.selectedFile.name ;
    const ref = this.store.ref(filePath);
    const task = this.store.upload(filePath,file);
    
    console.log(this.selectedFile);
    
    

    const alert = this.alertControl.create({
      message: 'La imagen se ha subido satisfactoriamente',
      subHeader: 'Ok',
      buttons: [
        
        { text: 'Confirmar', role: 'cancel', handler: () => console.log('Ok') }
      ]
    }).then(alert => {
      alert.present();
    });

    this.getFoto();

  
  }
  
hacerFoto() {
  const options: CameraOptions = {
    destinationType: this.camera.DestinationType.DATA_URL
  }
  this.camera.getPicture(options).then((imageData) => {
    this.fotos.push('data:image/jpeg;base64,' + imageData);
    console.log('data:image/jpeg;base64,' + imageData);
  }, (err) => {
    console.log(err);
  });
}


}
