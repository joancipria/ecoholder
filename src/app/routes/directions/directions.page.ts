import { Component, OnInit } from '@angular/core';
import { NavParams} from "@ionic/angular";

@Component({
  selector: 'app-directions',
  templateUrl: './directions.page.html',
  styleUrls: ['./directions.page.scss'],
})
export class DirectionsPage implements OnInit {

  constructor(
    private navParams: NavParams) { 
  }

  ngOnInit() {
  }

  public cerrarDirections() {
    this.navParams.data.parentRef.cerrarDirections();
  }
}
