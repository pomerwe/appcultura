import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  emailLostFocus=false;
  passwordInput='password';


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private menu:MenuController) {
  }

  ionViewDidLoad() {
   this.menu.enable(false);
  }

  login(values){
    console.log(values);
  }

  mostrarSenha(show){
    if(show==true){
      this.passwordInput = 'text';
    }
    else{
      this.passwordInput = 'password';
    }
    console.log(show);
  }
}
