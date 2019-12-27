import { Component, OnInit, NgZone } from '@angular/core';
import { NavParams } from "@ionic/angular";


@Component({
  selector: 'app-information',
  templateUrl: './information.page.html',
  styleUrls: ['./information.page.scss'],
})
export class InformationPage implements OnInit {

  constructor(private navParams: NavParams, public ngZone: NgZone) { }

  ngOnInit() {
  }

  public cerrarInfo(){
    this.navParams.data.parentRef.modalController.dismiss();
  }

}
