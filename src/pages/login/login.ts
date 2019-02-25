import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, LoadingController } from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { ContasChooseProvider } from '../../providers/contas-choose/contas-choose';
import { AlunoProvider } from '../../providers/aluno/aluno';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';


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
  user;
  loader;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private menu:MenuController,
              private http:HttpServiceProvider,
              private auth:AuthServiceProvider,
              private alert:AlertController,
              private loginService:LoginServiceProvider,
              public loadingCtrl: LoadingController,
              private aluno:AlunoProvider) {
                
                
  }

  ionViewDidLoad() {
    this.menu.enable(false);
    this.createloader();
  }

  createloader(){
    
   this.loader = this.loadingCtrl.create({
    spinner: "crescent",
    content:"Entrando..."
  });
  }
  ionViewDidLeave(){
    this.menu.enable(true);
    this.loader.dismiss();
  }

  login(boolean){ 
  
   if(boolean==true){
    this.navCtrl.setRoot('FeedPage');

   } 
  
  }

  mostrarSenha(show){
    if(show==true){
      this.passwordInput = 'text';
    }
    else{
      this.passwordInput = 'password';
    }
    
  }

  getAccess(credentials){
    this.loader.present();
    this.auth.login(credentials)
        .subscribe(
            data=>{
              this.loginService.setUserData(data);
              let uri='/contas';
              let params = {
                'id_resp':data.id,
                'example':'',
                'sort':'nome,asc'
              }
              this.contasVinculo(uri,params);
              
            }
            ,
            error=>{
              this.loader.dismiss();
              this.loginErrorAlert();
            }
    );

    
  }
  
  loginErrorAlert(){
    let alert = this.alert.create({
      title:'Erro de Autenticação',
      message: 'Verifique as informações e tente novamente',
      buttons:[
        {text:'OK',role:'cancel'}
      ]

    })
    this.createloader();
    alert.present();
  }


 
   contasVinculo(uri,params){
    this.http.get(uri,params)
    .subscribe(
           data => {   
            
            for(let contas of data){
              this.loginService.pushToContas(contas);
            }    
            this.login(true);
           
                  
          },
          error =>{
            console.log(error);
          }

        )

      }


    

}
