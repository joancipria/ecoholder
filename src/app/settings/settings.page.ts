import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Firebase } from '../core/services/firebase.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  userEmail: string;

  constructor(
    private navCtrl: NavController,
    private firebase: Firebase
  ) { }

  ngOnInit() {
    if (this.firebase.informacionUsuario()) {
      this.userEmail = this.firebase.informacionUsuario().email;
    }
  }


  logout() {
    this.firebase.logout()
      .then(res => {
        console.log(res);
        this.navCtrl.navigateBack('');
      })
      .catch(error => {
        console.log(error);
      })
  }

  
}
