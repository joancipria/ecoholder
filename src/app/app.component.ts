import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private push: Push
  ) {
    this.initializeApp();
     //Notificaciones push
    // comprobamos los permisos
    this.push.hasPermission()
    .then((res: any) => {
      if (res.isEnabled) {
        console.log('Tenemos permiso para enviar notificaciones');
      } else {
        console.log('No tenemos permiso para enviar notificaciones');
      }
    });
    // inicializamos la configuración para android y ios
    const options: PushOptions = {
    android: {
        senderID: '838602587969'
    }/*,
    ios: {
        senderID: 'SENDER_ID'//si no lo pones, se generará un token para APNS
        alert: 'true',
        badge: true,
        sound: 'false'
    },
    windows: {}*/
    };
    const pushObject: PushObject = this.push.init(options);
    pushObject.on('notification').subscribe((notification: any) => {
    //aquí recibimos las notificaciones de firebase
    });
    pushObject.on('registration').subscribe((registration: any) => {
      const registrationId = registration.registrationId;
    });
    pushObject.on('error').subscribe(error => {
      console.error('Error with Push plugin', error)
    });
    //FIn Notificaciones push
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

 
}