import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, LoadingController } from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { ContasChooseProvider } from '../../providers/contas-choose/contas-choose';

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
              private alert:AlertController,
              private loginService:LoginServiceProvider,
              public loadingCtrl: LoadingController) {
                
                
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


  getAccess(params){
    this.loader.present();
    this.http.getAccess(params)
    .subscribe(
      data =>{
        if(data.length == 0){
          
            this.loginErrorAlert();
            this.loader.dismiss();
            this.createloader();
          
        }
        else{
          this.loginService.setUserData(data[0]);
          this.loginService.getUserData()
          .then(
            data=>{
              this.user = data;
              this.getContasRoutine();
            }
          );
          
          
        }
       

      },
      error=>{
        console.log(error);
      }
    )

  }
  loginErrorAlert(){
    let alert = this.alert.create({
      title:'Erro de Autenticação',
      message: 'Verifique as informações e tente novamente',
      buttons:[
        {text:'OK',role:'cancel'}
      ]

    })
    alert.present();
  }


  checkAluno(params){
    this.http.getCheckAluno(params)
   .subscribe(
           data => {                        
            this.loginService.setContas(data);
            this.checkResp(this.user);
            
   
           
           
         },
         error =>{
           console.log(error);
         }
   
       );
      
  }

   checkResp(params){
     
    this.http.getCheckResp(params)
    .subscribe(
          data => {       
          if(data.length>0){
          
          this.contasVinculo(data[0]);  
         }else{
           this.login(true);
         }
            
         },
         error =>{
          console.log(error);
         }
       )
      
  }
 
   contasVinculo(params){
    this.http.getContasVinculo(params)
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


    getContasRoutine(){
      
      
      this.checkAluno(this.user);
      
      
    }

}
