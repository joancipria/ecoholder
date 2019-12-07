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
    this.hasPermission();
    
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  hasPermission(){
     //Notificaciones push
    // comprobamos los permisos
    this.push.hasPermission()
    .then((res: any) => {
      if (res.isEnabled) {
        this.push.createChannel({
          id:"CanalTest",
          description:"MiCanal",
          importance: 5
        }).then(()=> console.log('canal creado'))
        this.pushOptions();
        console.log('Tenemos permiso para enviar notificaciones');
      } else {
        console.log('No tenemos permiso para enviar notificaciones');
      }
    });
  }
  pushOptions(){
    // inicializamos la configuración para android y ios
    const options: PushOptions = {
      android: {
          senderID: '838602587969'
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      },
      windows: {},
      browser: {
        pushServiceURL:"http://push.api.phonegap.com/v1/push"
      }
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
  
    
}

