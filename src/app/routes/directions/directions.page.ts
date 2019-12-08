import { Component, OnInit, NgZone } from '@angular/core';
import { NavParams } from "@ionic/angular";

@Component({
  selector: 'app-directions',
  templateUrl: './directions.page.html',
  styleUrls: ['./directions.page.scss'],
})
export class DirectionsPage implements OnInit {

  rutaEnMarcha: boolean = false;

  constructor(
    private navParams: NavParams, public ngZone: NgZone) {
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
    this.ngZone.run(() => {
      this.rutaEnMarcha = true;
    });

    let label = encodeURI('My Label');
    window.open('geo:0,0?q=' + coords + '(' + label + ')', '_system');
  }
  public finalizarRuta(){
    this.navParams.data.parentRef.finalizarRuta();
    this.ngZone.run(() => {
      this.rutaEnMarcha = false;
    });
  }

  public agregarRutaAfavoritas(){
    this.navParams.data.parentRef.agregarRutaAfavoritas();
  }
}
