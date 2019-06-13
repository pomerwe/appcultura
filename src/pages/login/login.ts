
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, LoadingController } from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { NativeStorage } from '@ionic-native/native-storage';
import { ISubscription } from '../../../node_modules/rxjs/Subscription';
import { NetworkCheckServiceProvider } from '../../providers/network-check-service/network-check-service';
import { MyApp } from '../../app/app.component';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { FcmProvider } from '../../providers/fcm/fcm';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


 export class FirebaseUser{
    email:string;
    password:string;

    constructor(email:string,password:string){
      this.email = email;
      this.password = password;
    }
 }


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  alertAuthErrorTitle = '';
  alertAuthErrorMessage ='';
  loaderEntrandoLabel = '';


  ptEffect = false;
  enEffect = false;
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

              //Classe de serviço do login
              private loginService:LoginServiceProvider,
              public loadingCtrl: LoadingController,

              //LocalStorage nativo do celular
              private localStorage:NativeStorage,

              //Classe que utiliza plugin nativo que verifica conectividade com a internet
              private netCheck:NetworkCheckServiceProvider,

              //Importando a app component page
              private myApp:MyApp,

              //Classe de serviço pra algumas utilidades do nativeStorage
              private localStorageProvider:LocalStorageProvider,

              //Classe de serviço do firebase
              private fcm:FcmProvider,

              //Classe de serviço translate
              private translate:TranslateService
            ) 
            {
              
              this.loadTranslatedVariables();
           
  }


  ionViewWillEnter(){
    this.loadTranslatedVariables();
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
    this.loadTranslatedVariables();
   this.loader = this.loadingCtrl.create({
    spinner: "crescent",
    content:this.loaderEntrandoLabel
  });
  }
  
  //Função que após todos os procedimentos, passa o root pra Page relativa à quem está logado
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
  //Rotina que ocorre quando usuário escolhe se manter conectado
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
  //Rotina que ocorre quando o usuário escolhe manter o email salvo
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
              //Se o usuário escolher manter conectado set no nativeStorage os dados dele
              if(this.keepConnected==true) this.localStorage.setItem('user',data);

              //Checa se o usuário é ou não um funcionário da cultura
              if(data.role.match("FUNCIONARIO")!== null){
                //Aqui vai ocorrer uma série de fatores:
                //Criar uma variável de usuario do firebase com base no login realizado
                //Criar um usuário no firebase com os dados, caso já exista usuário, realiza login no firebase
                let firebaseUser:FirebaseUser = new FirebaseUser(`${data.username}@culturainglesamg.com.br`,`${data.id}${data.username}`);
                this.fcm.firebaseCreateUser(firebaseUser);
                this.myApp.funcao=data.role;

                //Seta os dados do usuario no login service
                this.loginService.setUserData(data);

                //Realiza login
                this.login(data.role)
              }
              else{
                //Aqui vai ocorrer uma série de fatores:
                //Criar uma variável de usuario do firebase com base no login realizado
                //Criar um usuário no firebase com os dados, caso já exista usuário, realiza login no firebase
                let firebaseUser:FirebaseUser = new FirebaseUser(`${data.username}`,`${data.id}${data.username}`);
                this.fcm.firebaseCreateUser(firebaseUser);
                this.myApp.funcao= 'USUARIO';

                //Seta os dados do usuario no login service
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
      title:this.alertAuthErrorTitle,
      message:this.alertAuthErrorMessage,
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

      changeLanguage(string){
        this.translate.use(string);
        this.myApp.setTitlePages();
        this.loadTranslatedVariables();
      }
      buttonEffects(effect){
        if(effect.match('ptEffect')!==null){
          this.ptEffect = true;
          setTimeout(()=>{
            this.ptEffect = false;
          },300);
        } 
        else if(effect.match('enEffect')!==null){
          this.enEffect = true;
          setTimeout(()=>{
            this.enEffect = false;
          },300);
        } 
      }

      loadTranslatedVariables(){
        this.translate.get(['loader_entrando','login_alertAuthError','login_alertAuthMessage'])
              .subscribe(
                data => {
                  this.loaderEntrandoLabel = data.loader_entrando;
                  this.alertAuthErrorTitle = data.login_alertAuthError;
                  this.alertAuthErrorMessage = data.login_alertAuthMessage;
                 
                }
              );
      }
      pushToLembrarSenha(){
        this.navCtrl.push('LembrarSenhaPage',{push:true});
      }
}
