import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
// Auth
import { AuthenticateService } from '../core/services/authentication.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService
  ) { }

  ngOnInit() {
    if (this.authService.userDetails()) {
      //this.userEmail = this.authService.userDetails().email;
    } else {
      this.navCtrl.navigateBack('');
    }
  }

}
