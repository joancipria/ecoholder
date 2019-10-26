import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// BLE
import { ReceptorBLE } from "./core/services/receptorBLE.service";
import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { BeaconProvider } from "./core/services/beaconprovider.service";
import { Device } from '@ionic-native/device/ngx';


// GPS
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocalizadorGPS } from "./core/services/LocalizadorGPS.service";

// Servidor Fake
import { ServidorFake } from "./core/services/servidorFake.service";
import { HttpClientModule } from '@angular/common/http';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { Firebase } from './core/services/firebase.service';

// Auth
import { AuthenticateService } from './core/services/authentication.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// Google maps
import { GoogleMaps } from '@ionic-native/google-maps';
import { Maps } from './core/services/maps.service';


import * as firebase from 'firebase';

firebase.initializeApp(environment.firebaseConfig);


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
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
    ServidorFake,
    HttpClientModule,
    Firebase,
    GoogleMaps,
    Maps,
    IBeacon,BeaconProvider,Device,
    AuthenticateService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
