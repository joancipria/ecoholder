/*********************************************************************
@name previousMaps.compoponent.ts
@description Lógica del histórico de mapas
@author Diana Hernández Soler
@date 10/01/2020
@license GPLv3
*********************************************************************/
import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, IonSelect, ModalController, IonRow } from "@ionic/angular";

// Servicio de Mapas
import { Maps } from '../../core/services/maps.service';

@Component({
  selector: 'app-previous-maps',
  templateUrl: './previous-maps.component.html',
  styleUrls: ['./previous-maps.component.scss'],
})
export class PreviousMapsComponent implements OnInit {
  @ViewChild('map', { static: false }) element: any;
  @ViewChild('search', { static: false }) elementSearch: any;
  private cuadricula = false;
  private toggleCuadricula = false;
  public fecha: Date;
  public average = 'good';
  public measuresNumber: any;
  public showDivInfo = false;

  constructor(public maps: Maps, public plt: Platform,  public modalController: ModalController) { }

  ngOnInit() {
  }

   // Wait for dom
   async ionViewWillEnter() {
    this.plt.ready().then(() => {
      // Load just once
      this.maps.initPreviousMaps(this.element);
    });
  }

    /**********************************************
    @description Mostrar/Ocultar cuadricula/mapa de calor y viceversa
    @design fecha: string -> f() -> void
    @author Diana Hernández Soler
    @date 11/01/2020
    ***********************************************/
    public showMap($event) {
      this.fecha = new Date($event.target.value);
      const  date = +new Date(this.fecha);
      if (!this.cuadricula) {
          this.maps.getClosestDate(date);
          setTimeout( () =>{this.measuresNumber = this.maps.getNumberMeasures(); }, 2000);
          this.cuadricula = true;
          this.showDivInfo = true;
          console.log(this.showDivInfo);
          return;
        }
      this.toggleCuadricula = this.maps.toggleCuadricula();
    }

}