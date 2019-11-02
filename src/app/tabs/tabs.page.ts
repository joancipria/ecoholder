import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
// Auth
import { Firebase } from '../core/services/firebase.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private firebase: Firebase
  ) { }

  ngOnInit() {
    if (this.firebase.informacionUsuario()) {
      //this.userEmail = this.authService.informacionUsuario().email;
    } else {
      this.navCtrl.navigateBack('');
    }
  }

}
