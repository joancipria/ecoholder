import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// BLE
import { BLE } from "@ionic-native/ble/ngx";
import { ReceptorBLE } from "./core/services/receptorBLE.service";

// GPS
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocalizadorGPS } from "./core/services/LocalizadorGPS.service";

// Servidor Fake
import { ServidorFake } from "./core/services/servidorFake.service";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BLE,
    Geolocation,
    LocalizadorGPS,
    ReceptorBLE,
    ServidorFake
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
