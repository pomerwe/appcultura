import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, LoadingController } from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { ContasChooseProvider } from '../../providers/contas-choose/contas-choose';
import { AlunoProvider } from '../../providers/aluno/aluno';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { NativeStorage } from '@ionic-native/native-storage';
import { ISubscription } from '../../../node_modules/rxjs/Subscription';
import { NetworkCheckServiceProvider } from '../../providers/network-check-service/network-check-service';

import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { LocalNotifications } from '../../../node_modules/@ionic-native/local-notifications';
import { MyApp } from '../../app/app.component';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
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
  //Controla a Div que mostra mensagem de email inválido
  emailLostFocus=false;

  //Controla se o imput password vai ser de password ou de text
  passwordInput='password';

  //Será set com um Loader
  loader;

  keepConnected = false;

  //Controla se o email já vai estar set no imput
  setEmail='';

  //Controla se o checkbox já vai estar checked
  saveChecked;

  //Armazena todos os subscribes de Observables
  subscriptions:Array<ISubscription> = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private menu:MenuController,
              private http:HttpServiceProvider,
              private auth:AuthServiceProvider,
              private alert:AlertController,
              private loginService:LoginServiceProvider,
              public loadingCtrl: LoadingController,
              private aluno:AlunoProvider,
              private localStorage:NativeStorage,
              private netCheck:NetworkCheckServiceProvider,
              private push: Push,
              private myApp:MyApp,
              private localStorageProvider:LocalStorageProvider
            ) {
              
              this.push.hasPermission()
              .then((res: any) => {
            
                if (res.isEnabled) {
                  const options: PushOptions = {
                    android: {},
                    ios: {
                        alert: 'true',
                        badge: true,
                        sound: 'false'
                    },
                    windows: {},
                    browser: {
                        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
                    }
                 };

                 const pushObject: PushObject = this.push.init(options);
                 pushObject.on('notification')
                 .subscribe((notification: any) => {
                  window.alert(notification.message); 
                 });

                 pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

                 pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
                } else {
                  console.log('We do not have permission to send push notifications');
                }
            
              });
            
           
  }
  ionViewWillEnter(){
   
  }
  ionViewDidLoad() {
    //Armazena no native storage se o usuário marcou ou não o checkbox de lembrar
    this.localStorage.getItem('saveChecked')
      .then(
        item=>{
          this.saveChecked =  item == 'true' ? true : false;
        }
    )
    .catch(
      error=>{
      this.saveChecked=false;
    });    
    
    //Obtem do native storage o email, se estiver set previamente
    this.localStorage.getItem('Email')
    .then(
      item=>{      
        this.setEmail = item;
      }
    );
    
    //Bloqueia a interação com o menu
    this.menu.enable(false);
    this.createloader();
  }
  ionViewDidLeave(){
    //Libera a interação com o menu ao sair da page
    this.menu.enable(true);
    this.loader.dismiss();
    this.subscriptions.forEach(
      subs=>{subs.unsubscribe();}
    );
  }

  //Função que instancia um loader na variável loader
  createloader(){
    
   this.loader = this.loadingCtrl.create({
    spinner: "crescent",
    content:"Entrando..."
  });
  }
  
  //Função que após todos os procedimentos, passa o root pra FeedPage
  login(role){ 
    this.keepConnectedRoutine(role);
    this.saveEmailRoutine();
    if(role.match("FUNCIONARIO")===null){
       this.navCtrl.setRoot('FeedPage');

    }
    else{
      this.navCtrl.setRoot('ProfessorPage');
    }
   
   
    
   
  
  }

  keepConnectedRoutine(role){
    
    if(this.keepConnected==true){
      this.localStorageProvider.keepConnected=true;
      if(role.match("FUNCIONARIO")===null){
        this.localStorage.setItem('keepConnected','true');
        this.localStorage.setItem('rootPage','FeedPage');

      }
      else{
        this.localStorage.setItem('keepConnected','true');
        this.localStorage.setItem('rootPage','ProfessorPage');
      }
      
        
    }
    else{
      this.localStorage.remove('keepConnected');
      this.localStorage.remove('rootPage');
    }

  }
  saveEmailRoutine(){
    //Checa se o checkbox estava marcado e então toma ações de acordo com a escolha do usuário
   if(this.saveChecked==true){
    //Mantém o email salvo ao entrar no app
    this.localStorage.setItem('saveChecked','true'); 
    this.localStorage.setItem('Email',this.loginService.getUserData().username);    
    
    } 
   else{
    //Tira o email salvo que estava previamente / não mantém salvo
    this.localStorage.remove('saveChecked');
    this.localStorage.remove('Email');       
    
   }
  }


  showIt(show){
    console.log(show);
    console.log(this.saveChecked);
  }
 
  //Faz com que o checkbox mostre ou não a senha
  mostrarSenha(eye){
    
    if(this.passwordInput == 'text'){this.passwordInput = 'password';eye.classList.remove('checked');}
    else{ this.passwordInput = 'text'; eye.classList.add('checked');}
   
      
    
    
  }
  //Requisição que busca o token de acordo com as informações passadas na requisição
  getAccess(credentials){
    this.loader.present();
    this.subscriptions.push(
      this.auth.login(credentials)
        .subscribe(
            data=>{

              
              if(this.keepConnected==true) this.localStorage.setItem('user',data);
              //Checa se o usuário é ou não um funcionário
              if(data.role.match("FUNCIONARIO")!== null){
                this.myApp.funcao=data.role;
                this.loginService.setUserData(data);
                this.login(data.role)
              }
              else{
                this.myApp.funcao= 'USUARIO';
                this.loginService.setUserData(data);
                let uri='/contas';
                let params = {
                  'id_resp':data.id,
                  'example':'',
                  'sort':'nome,asc'
                }
                this.contasVinculo(uri,params);
              }
            }
            ,
            error=>{
              console.log(error);
              //Após 500 ms, verifica se há conexão, se há, dispara um alert, se não, dispara outro alert
              setTimeout(()=>{
                this.loader.dismiss();
                this.netCheck.check() == true ? this.loginErrorAlert() : this.netCheck.notConnected();
                this.createloader();
              },500);
              
              
              
              
            }
    ));
   
    
    
  }
  //Alerta de erro de login por autenticação incorreta
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

  


   //Faz uma requisição ue busca todos os dependentes vinculados à conta que foi autenticada
   contasVinculo(uri,params){
    this.http.get(uri,params)
    .subscribe(
           data => {   

            //Ao carregar os dados, todas as contas vinculadas são jogadas para o provider LoginService
            for(let contas of data){
              this.loginService.pushToContas(contas);
            } 
            if(this.keepConnected==true) this.localStorage.setItem('contas',this.loginService.getContas());
            this.login(this.auth.getUser().role);
           
                  
          },
          error =>{
            console.log(error);
          }

        )

      }


    

}
