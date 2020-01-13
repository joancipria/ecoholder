/*********************************************************************
@name routes.page.ts
@description Lógica correspondiente a la vista "Routes" 
@author Joan Ciprià Moreno Teodoro
@date 10/09/2019
@license GPLv3
*********************************************************************/

import { Component, NgZone, ViewChild, OnInit, ElementRef } from "@angular/core";
import { Router } from '@angular/router';
import { AlertController, ToastController, NavController, Platform, IonSelect } from "@ionic/angular";

// Directions moddal
import { DirectionsPage } from './directions/directions.page';

// Services
import { ReceptorBLE } from "../core/services/receptorBLE.service";
import { Firebase } from '../core/services/firebase.service';
import { Maps } from '../core/services/maps.service';
import { Routes } from '../core/services/routes.service';


// tutorial
import { ModalController } from '@ionic/angular';
import { Helper } from '../core/helper';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.page.html',
  styleUrls: ['./routes.page.scss'],
})
export class RoutesPage implements OnInit {
  @ViewChild('map', { static: false }) element;
  @ViewChild('search', { static: false }) elementSearch;
  @ViewChild('directionsButton', { static: false }) elementDirectionsButton;
  showSelectContaminante: boolean = false;
  @ViewChild('select', { static: false }) select: IonSelect;
  private cuadricula = false;
  private toggleCuadricula:boolean = false;
  private directionsModal: any;
  public sideMenu: boolean = false;

  constructor(
    private router: Router,
    public navCtrl: NavController,
    private ble: ReceptorBLE,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private ngZone: NgZone,
    public firebase: Firebase,
    public maps: Maps,
    public plt: Platform,
    public modalController: ModalController,
    private helper: Helper,
    public routes: Routes
  ) {
  }

  ngOnInit() {
  this.sideMenu = this.helper.comprobarRol();
  // Raquel. Mostrar tutorial si es la primera vez
  //this.helper.MostrarTutorial(this.navCtrl, 'photos');
  }

  // Wait for dom
  async ionViewWillEnter() {
    // Crear modal
    this.directionsModal = await this.modalController.create({
      component: DirectionsPage,
      backdropDismiss: false,
      componentProps: {parentRef: this}
    });
    this.directionsModal.style = "display: none;" // Ocultar por defecto
    this.directionsModal.present();

    this.plt.ready().then(() => {
      // Load just once
      this.maps.inicializarMapa(this.element, this.elementSearch, this.directionsModal.childNodes[1], this.elementDirectionsButton);
    });

  }

  // ----------------------------------------------------------------------
  // Evento que se ejecuta al cambiar de contaminante
  // evento onChange -> f() ->
  // ------------------------------------------------------------------------
  onChangeContaminante($event) {

    console.log("el sensor seleccionado es: " + $event.target.value);

    const contaminanteSeleccionado = $event.target.value;
    switch (contaminanteSeleccionado) {
      case 'CO2':
        const g = [
          'rgba(255, 0, 0, 0)',
          'rgba(255, 255, 0, 0.9)',
          'rgba(0, 255, 0, 0.7)',
          'rgba(173, 255, 47, 0.5)',
          'rgba(152, 251, 152, 0)',
          'rgba(152, 251, 152, 0)',
          'rgba(0, 0, 238, 0.5)',
          'rgba(186, 85, 211, 0.7)',
          'rgba(255, 0, 255, 0.9)',
          'rgba(255, 0, 0, 1)'];
        this.maps.cambiarGradiente(g);

        this.maps.cambiarRadius(60);
        break;
      case 'NOX':


        const gradient = [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 0, 223, 1)',
          'rgba(0, 0, 191, 1)',
          'rgba(0, 0, 159, 1)',
          'rgba(0, 0, 127, 1)',
          'rgba(63, 0, 91, 1)',
          'rgba(127, 0, 63, 1)',
          'rgba(191, 0, 31, 1)',
          'rgba(255, 0, 0, 1)'
        ];
        this.maps.cambiarGradiente(gradient);
        this.maps.cambiarRadius(80);
        break;

      case 'SO2':
        this.maps.cambiarRadius(20);

    }
  }

  // ----------------------------------------------------------------------
  // Mostrar / Ocultar el select de contaminante
  // -> f() ->
  // ------------------------------------------------------------------------
  toggleSelectorContaminante() {
    this.select.open();
    // this.showSelectContaminante = !this.showSelectContaminante;
    // this.maps.toggleMapaCalor();
  }

  // -----------------------------------------------------------
  // this.cuadricula inicializado a false
  // Mostrar/Ocultar cuadricula/mapa de calor y viceversa
  // -> f() ->
  // Diana Hernández Soler
  // -----------------------------------------------------------
  public mostrarGrid(): void {
    this.maps.toggleMapaCalor();
    if (!this.cuadricula) {
      this.maps.generarCuadricula();
      this.cuadricula = true;
      return;
    }
    this.toggleCuadricula = this.maps.toggleCuadricula();
  }

  public mostrarDirections() {
    this.directionsModal.style.display = "flex";
  }

  public cerrarDirections() {
    this.directionsModal.style.display = "none";
  }
  public empezarRuta() {
    this.routes.empezarRuta();
  }

  public finalizarRuta() {
    this.routes.finalizarRuta();
  }

  public agregarRutaAfavoritas(){
    this.firebase.agregarRutaAfavoritas(this.maps.destination, this.elementSearch.value);
  }
}
