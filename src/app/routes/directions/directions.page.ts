import { Component, OnInit } from '@angular/core';
import { NavParams } from "@ionic/angular";

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

  public openGoogleMaps() {
    let destination = this.navParams.data.parentRef.maps.destination;
    let coords = destination.lat+","+destination.lng;
    this.navParams.data.parentRef.empezarRuta();

    let label = encodeURI('My Label');
    window.open('geo:0,0?q=' + coords + '(' + label + ')', '_system');
  }
}
