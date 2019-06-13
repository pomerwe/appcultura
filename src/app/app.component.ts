import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, IonicApp, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ContasChooseProvider } from '../providers/contas-choose/contas-choose';
import { LoginServiceProvider } from '../providers/login-service/login-service';
import { AlunoProvider } from '../providers/aluno/aluno';
import { Functions } from '../functions/functions';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { UtilServiceProvider } from '../providers/util-service/util-service';
import { Device } from '../../node_modules/@ionic-native/device';
import { DeviceServiceProvider } from '../providers/device-service/device-service';
import {timer} from 'rxjs/observable/timer';
import { NavigationBar } from '../../node_modules/@ionic-native/navigation-bar';
import { BackgroundMode, BackgroundModeConfiguration } from '../../node_modules/@ionic-native/background-mode/';
import { NativeStorage } from '../../node_modules/@ionic-native/native-storage';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
import * as __ from 'underscore';
import { DomSanitizer } from '../../node_modules/@angular/platform-browser';
import { ProfessorProvider } from '../providers/professor/professor';
import { FcmProvider } from '../providers/fcm/fcm';
import { tap } from 'rxjs/operators';
import { LocalNotifications } from '@ionic-native/local-notifications';
import * as firebase from 'firebase'
import { TranslateService } from '@ngx-translate/core';
import { HttpServiceProvider } from '../providers/http-service/http-service';
import { AndroidPermissions } from '@ionic-native/android-permissions';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  

  @ViewChild(Nav) nav: Nav;
  
  ptEffect = false;
  enEffect = false;
  notasPageTitle:string = '';
  financeiroPageTitle:string = '';
  calendarioPageTitle:string = '';
  loaderExitingLabel = '';
  alertDesejaMesmoSair = '';

  //Variável que determina se as contas já foram carregadas 
  //na div Popover, que é a div onde o usuário troca de conta
  carregado=false;

  //Array de contas que serão carregadas na div Popover
  contas: Array<any> = [];

  //Variável que determina se a div Popover é mostrada ou não
  clicked=false;

  //Matrícula que é exibida no menu
  matricula: string;

  //Nome que é exibido no menu
  nome: string;

  //Usuario que é exibido no menu
  usuario:string;

  //Urn da foto que será juntada a Url da api
  photoUrl;

  //Variável que marca a opção selecionada da Div Popover
  checked:boolean;

  //Variável padrão do AppComponent que define a primeira rootPage
  rootPage: any = 'LoginPage';

  //Variável que representa a FUNÇÃO DO USUÁRIO
  funcao: String = 'USUARIO';

  //Variável que controla a Login Splash 
  showSplash = true;

  //Background default do menu
  defaultMenuBackground= 'url(http://s3-us-west-2.amazonaws.com/br.com.ccsp.assets/wp-content/uploads/2018/10/16160536/quintal_marca_culturainglesa-1024x335.png)';

  //Background do menu
  background = 'url(https://blog.emania.com.br/content/uploads/2016/02/direitos-autorais-e-de-imagem.jpg)';

  //pages: Array<{title: string, component: any}>;
  pages;

  backgroundOptions:BackgroundModeConfiguration = {
    title:"Aplicativo aberto em segundo plano",
    text:"Toque para abrir"
  };

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private menu:MenuController,
    private ionicApp:IonicApp, 
    private contasChoose:ContasChooseProvider,
    private loginService:LoginServiceProvider,
    private aluno:AlunoProvider,
    private functions:Functions,
    public loadingCtrl: LoadingController,
    private auth:AuthServiceProvider,
    private util:UtilServiceProvider,
    private device:Device,
    private deviceServ:DeviceServiceProvider,
    private navBar:NavigationBar,
    private backgroundMode: BackgroundMode,
    private localStorage:NativeStorage,
    private localStorageProvider:LocalStorageProvider,
    private sanitizer:DomSanitizer,
    private professor:ProfessorProvider,
    private fcm: FcmProvider,
    private localNotifications: LocalNotifications,
    public translate: TranslateService,
    private http:HttpServiceProvider,
    private androidPermissions:AndroidPermissions

    ) {
    this.initializeApp();
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
         result => {
          if(!result.hasPermission){this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)

         }
        }
    );
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
      result => {
       if(!result.hasPermission){
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE);
       }
      }
    );
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => {
        if(!result.hasPermission){this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)

        }
      }
    );
    if(this.platform.is('ios') || this.platform.is('android')){
      this.localNotifications.on('click')
      .subscribe(
        data=>{
          let urn='/notificacao'
          this.http.post(`${urn}/${data.id}`,"")
          .subscribe(
            ()=>console.log('success')
          );
          this.nav.setRoot('FeedPage');
        }
      );
    }
    firebase.auth().onAuthStateChanged(
      user=>{
        if(user){

           // Listen to incoming messages
           this.fcm.listenToNotifications().pipe(
             tap(msg => {
               this.localNotifications.schedule({
                 id: msg.id,
                 data:{id:msg.id},
                 title:msg.title,
                 text:msg.body,
                 priority: 2,
                 silent: false,
                 wakeup: true,
                 icon:""
                 
               });
             })
           )
           .subscribe();   
        }
      }
    );
    translate.setDefaultLang('en');
    // used for an example of ngFor and navigation
    this.loadTranslatedVariables();
    this.setTitlePages();
    
    this.pages = [{

      funcao:'USUARIO',
      pages:  [
     { title: this.notasPageTitle, component: 'NotasPage' },
     { title: this.financeiroPageTitle, component: 'FinanceiroPage'},
     { title: 'Chat', component: 'ChatPage'}
     ]},
     {

       funcao:'FUNCIONARIO',
       pages:  [
      { title: this.calendarioPageTitle, component: 'CalendarioProfessorPage' }
      ]}
   ];
   
      this.pages =__.indexBy(this.pages,'funcao');
    
  

  }

  initializeApp() {
    this.platform.ready().then(() => {

     
 
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.deviceServ.setPlatform(this.device.platform);
      this.statusBar.hide();
      this.splashScreen.hide();
      this.backgroundMode.enable();
      this.backgroundMode.setDefaults(this.backgroundOptions);
      let autoHide: boolean = false;
      this.navBar.setUp(autoHide);
      // this.localStorage.keys().then(data=>console.log(data));
      this.localStorage.getItem('keepConnected')
      .then(
        enabled =>{
          this.localStorageProvider.keepConnected = true;
          if(this.localStorageProvider.isEnabled()) this.localStorage.getItem('user')
          .then(
            user=>{
              console.log(user);
              this.loginService.setUserData(user);

              user.role.match('FUNCIONARIO') !== null ? this.funcao = user.role : this.funcao = 'USUARIO';
              if(this.loginService.getUserData().role.match("FUNCIONARIO")!==null){
                  this.professor.setProfessor(this.loginService.getUserData());
                  
              }
              else{
                this.localStorage.getItem('contas')
                  .then(
                    contas=>contas.forEach(cont=>this.loginService.setContas(cont))
                  );

              }
              this.localStorage.getItem('rootPage')
                .then(
                    rp=>{
                      
                      console.log(rp);
                      this.nav.setRoot(rp);
                    }
                );
            }
          );
          
          
        })
      .catch(()=>{
        this.localStorageProvider.keepConnected = false
      });
      timer(1200).subscribe(()=> this.showSplash = false);
      
       
    });
    //Função, da variável Platform, que registra as ações
    // do botão de voltar do navBar nativo do android
    this.platform.registerBackButtonAction(() => {
      this.platform.ready().then(() => {
      this.menu.close();
      
      let pop:boolean = this.closeModals();
      if (this.nav.canGoBack() && pop == true) {
      this.nav.pop({animate:false,direction:'back',animation:'slide',duration:300});
        return;
      }
      else if(this.nav.getActive().id.match("LoginPage")!==null && pop == true){
        if(window.confirm(this.alertDesejaMesmoSair)===true) this.platform.exitApp();
      }
      else if(this.nav.getActive().id.match("ProfessorPage")!==null && pop == true || this.nav.getActive().id.match("FeedPage")!==null && pop == true){
        
        this.backgroundMode.moveToBackground();
      }
      
    
      });
    }, 0);
  }
  
  //Método criado para dar push em todos as pages listadas no menu
  openPagePush(page){
    this.menu.close();
    this.nav.push(page.component,{"push":true});
    
    
   
    
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component)
      
  }

  //Função que fecha todo tipo de overlay que se encontra aberto no app. 
  //Ex: Alerts, ActionSheets, Pushed Pages, etc
  closeModals(): boolean{
    let activePortal = this.ionicApp._loadingPortal.getActive() ||
    this.ionicApp._modalPortal.getActive() ||
    this.ionicApp._toastPortal.getActive() ||
    this.ionicApp._overlayPortal.getActive();
    
    if (activePortal) {
      activePortal.dismiss();
      return false;
    }else{
      return true;
    }
    
    }
    //Função que carrega todas as contas que estão vinculadas ao usuario que entrou no app
    //Nota: Carrega de um provider chamado LoginService
    carregarContas(){
      if(this.carregado==false){
        let c = this.loginService.getContas();    
        for(let acc of c){
          //Cria um Id para que seja tratado depois na div Popover qual conta está selecionada
          //Nota: Ver função contaChoose();
          let contaId = c.indexOf(acc);
          //Função que deixa a Uri da foto do usuário carregada
          let photoUrl = this.sanitizer.bypassSecurityTrustStyle(`url(${this.util.getFoto(acc.foto)})`);
          let conta= {matricula:acc.matricula,nome:this.functions.nomes(acc.nome),usuario:acc.email,contaId:contaId,checked:acc.checked,photo:photoUrl,base:acc.base}
          this.contas.push(conta);
          
          
        }
      }
      else{
        return 0;
      }
    }

    //Função que faz com que a div Popover suma após ser selecionada uma opção
    //Nota:Ocorre após 200 ms, de acordo com o que está configurado
    clickedTime(){
      setTimeout(
        ()=>{this.clicked=false;}
        ,200)
    }
    
    //Função que trata o evento de escolha do RadioAlert quando o usuário 
    //tem mais de uma conta vinculada e acabada de entrar no app
    //Nota:Esse evento vem de um provider que chama ContasChoose
    contaChoose(event){
      //Set nas variáveis do menu
      this.nome = event.nome;
      this.matricula = event.matricula;
      this.usuario = event.usuario;
      this.photoUrl = event.photo;
      //Deixa todas as contas como "não selecionadas" na div Popover
      for(let acc of this.contas){
        let id = acc.contaId;
        this.contas[id].checked=false;
      }
      //Deixa como "selecionada" apenas a conta que foi selecionada no Alert de ContasChoose
      this.contas[event.contaId].checked=true;
      //Set o aluno que está selecionado no provider Aluno, 
      //o qual será utilizado em todas as outras Pages
      this.aluno.setAluno(event);   
      this.aluno.getAluno()
        .then(
          data=>{
            
            this.nav.setRoot('FeedPage');
            setTimeout(()=>
            {
              this.menu.close();
            },350
          );
            
            
          },
          error=>{
            console.log(error);
          }
        );
      
    
      // this.contasChoose
      // .contasChoose()
      // .then(
      //   data=>{
      //     this.aluno.setAluno(data);
      //     // this.nav.setRoot('FeedPage');
      //   }
      // );
    }
    //Função que faz logout. Basicamente chama várias funções 
    //que unset as variáveis de providers e remove o token do NativeStorage(LocalStorage)
    logout(){
     if(confirm(this.alertDesejaMesmoSair)===true){
      
      //Firebase logout
      this.fcm.firebaseSignOut();
        
      this.loadTranslatedVariables();
      //Série de remoções do nativeStorage
      this.localStorageProvider.logout();

      //Função que cria um loader novamente, pois toda vez que ele é dismiss(), deixa de existir.
      let loader = this.loadingCtrl.create({
        spinner: "crescent",
        content:this.loaderExitingLabel
      });
      //Unset na variável contas
      while(this.contas.length){
        this.contas.pop();
      }

      //Set para falso na variável que controla a função que carrega contas;
      this.carregado=false;

      //A seguir sequência de funções definidas em outras classes para unset de variáveis
      this.aluno.unsetAluno();
      this.contasChoose.unsetContas();
      this.loginService.logoff();
      this.professor.unsetProfessor();
      //Set para falso, para sumir com a div Popover
      this.clicked=false;

      loader.present();

      //Função que remove o Token do NativeStorage
      setTimeout(()=>{
        this.auth.logout()
          .subscribe(
            data=>{
              
                loader.dismiss();
                this.nav.setRoot('LoginPage');
            
            }
            ,
            error=>{
              console.log(error);
              localStorage.removeItem('access_token');
              loader.dismiss();
              this.nav.setRoot('LoginPage');
            }

          );
      },1600);
      
      
    }
  }
  loadTranslatedVariables(){
this.translate.get(['loader_saindo','alert_desejamesmosair'])
      .subscribe(
        data => {
          this.loaderExitingLabel = data.loader_saindo;
          this.alertDesejaMesmoSair = data.alert_desejamesmosair;
      
         
        }
      );
  }
  setTitlePages(data?){
    if(data==undefined){
      this.translate.get(['menu_notas','menu_financeiro','menu_calendario'])
      .subscribe(
        data => {
          this.setTitlePages(data);
          
      
         
        }
      );
    }
    else{
      this.notasPageTitle = data.menu_notas;
      this.financeiroPageTitle = data.menu_financeiro;
      this.calendarioPageTitle = data.menu_calendario;
      this.pages = [{
  
        funcao:'USUARIO',
        pages:  [
       { title: this.notasPageTitle, component: 'NotasPage' },
       { title: this.financeiroPageTitle, component: 'FinanceiroPage'},
       { title: 'Chat', component: 'ChatPage'}
       ]},
       {
  
         funcao:'FUNCIONARIO',
         pages:  [
        { title: this.calendarioPageTitle, component: 'CalendarioProfessorPage' }
        ]}
     ];
     this.pages =__.indexBy(this.pages,'funcao');
    }
    
    
  }

  changeLanguage(string){
    this.translate.use(string);
    this.setTitlePages();
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
  

  resetBackButtonActions(){
    this.platform.registerBackButtonAction(() => {
     
      this.menu.close();
      
      let pop:boolean = this.closeModals();
      if (this.nav.canGoBack() && pop == true) {
      this.nav.pop({animate:false,direction:'back',animation:'slide',duration:300});
        return;
      }
      else if(this.nav.getActive().id.match("LoginPage")!==null && pop == true){
        if(window.confirm(this.alertDesejaMesmoSair)===true) this.platform.exitApp();
      }
      else if(this.nav.getActive().id.match("ProfessorPage")!==null && pop == true || this.nav.getActive().id.match("FeedPage")!==null && pop == true){
        
        this.backgroundMode.moveToBackground();
      }
      
    
   
    }, 0);
  }
}
