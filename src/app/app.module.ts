import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
//import { NgZone } from '@angular/core';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// BLE
import { ReceptorBLE } from './core/services/receptorBLE.service';
import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { Beacon } from './core/services/beacon.service';
import { Device } from '@ionic-native/device/ngx';
import { BLE } from '@ionic-native/ble/ngx';

// Android permissions
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

// GPS
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocalizadorGPS } from './core/services/LocalizadorGPS.service';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';


// Servidor Fake
import { ServidorFake } from './core/services/servidorFake.service';
import { HttpClientModule } from '@angular/common/http';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { Firebase } from './core/services/firebase.service';

// Auth
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// Google maps
import { Maps } from './core/services/maps.service';

// Local Storage
import { LocalStorage } from './core/services/localStorage.service';
import { IonicStorageModule } from '@ionic/storage';

// Import firebase and load config
import * as firebase from 'firebase';

// Camara
import { Camera } from '@ionic-native/camera/ngx';

// Helper
import { Helper } from './core/helper';

// Directions moddal
import { DirectionsPage } from './routes/directions/directions.page';

// Info modal
import { InformationPage } from './home/information/information.page';

import { Routes } from './core/services/routes.service'

// Notificaciones
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

firebase.initializeApp(environment.firebaseConfig);


@NgModule({
  declarations: [AppComponent,DirectionsPage, InformationPage],
  entryComponents: [DirectionsPage, InformationPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
     AngularFirestoreModule,
     AngularFireAuthModule,
     ReactiveFormsModule

  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation,
    LocalizadorGPS,
    ReceptorBLE,
    LocalStorage,
    Helper,
    BLE,
    ServidorFake,
    HttpClientModule,
    Firebase,
    Maps,
    Camera,
    IBeacon,
    Beacon,
    Device,
    LocationAccuracy,
    AndroidPermissions,
    Routes,
    LocalNotifications
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
