import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController, Platform } from '@ionic/angular';

// Importar service
import { Firebase } from '../core/services/firebase.service';
import { LocalizadorGPS } from "../core/services/LocalizadorGPS.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validations_form: FormGroup;
  errorMessage: string = '';

  constructor(

    private navCtrl: NavController,
    private firebase: Firebase,
    private formBuilder: FormBuilder,
    private gps: LocalizadorGPS,
    public plt: Platform


  ) { 
    if (plt.is('android')) {
      this.gps.checkGPSPermission();
    }else{
      this.gps.updatePosition();
    }
  }

  ngOnInit() {

    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });
  }


  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' }
    ]
  };
 

  loginUser(value){
    this.firebase.loginUser(value)
    .then(res => {
      console.log(res);
      this.errorMessage = "";
      this.navCtrl.navigateForward('/app/tabs/home');
    }, err => {
      this.errorMessage = err.message;
    })
  }

  goToRegisterPage(){
    this.navCtrl.navigateForward('/register');
  }

}
