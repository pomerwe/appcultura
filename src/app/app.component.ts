import { Component, ViewChild, Input } from '@angular/core';
import { Nav, Platform, MenuController, IonicApp, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ContasChooseProvider } from '../providers/contas-choose/contas-choose';
import { LoginServiceProvider } from '../providers/login-service/login-service';
import { AlunoProvider } from '../providers/aluno/aluno';
import { Functions } from '../functions/functions';





@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  

  @ViewChild(Nav) nav: Nav;
  carregado=false;
  contas: Array<any> = [];
  clicked=false;
  matricula: string;
  nome: string;
  email:string;
  checked:boolean;
  rootPage: any = 'LoginPage';
  perfil = false;
  

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private menu:MenuController,
    private ionicApp:IonicApp, 
    private contasChoose:ContasChooseProvider,
    private loginService:LoginServiceProvider,
    private aluno:AlunoProvider,
    private functions:Functions,
    public loadingCtrl: LoadingController) {
    this.initializeApp();
    

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Notas', component: 'NotasPage' }
    ];
    
  

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.platform.registerBackButtonAction(() => {
      this.platform.ready().then(() => {
      this.menu.close();
      
      let pop:boolean = this.closeModals();
       if (this.nav.canGoBack() && pop == true) {
        this.nav.pop();
         return;
       }
       
    
      });
    }, 0);
  }
  

  openPagePush(page){
    this.nav.push(page.component);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

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

    carregarContas(){
      if(this.carregado==false){
        let c = this.loginService.getContas();    
        for(let acc of c){
          let contaId = c.indexOf(acc);
          let conta= {id:acc.id,nome:this.functions.nomes(acc.nome),email:acc.email,contaId:contaId,checked:acc.checked}
          this.contas.push(conta);
          
          
        }
      }
      else{
        return 0;
      }
    }

    clickedTime(){
      setTimeout(
        ()=>{this.clicked=false;}
        ,200)
    }
    
    contaChoose(event){
      this.nome = event.nome;
      this.matricula = event.id;
      this.email = event.email;
      console.log(event);
      for(let acc of this.contas){
        let id = acc.contaId;
        this.contas[id].checked=false;
      }
      this.contas[event.contaId].checked=true;
      this.aluno.setAluno(event);   
      this.aluno.getAluno()
        .then(
          data=>{
            
            this.nav.setRoot('FeedPage');
            setTimeout(()=>
            {
              this.menu.close();
            },250
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

    logout(){
      let loader = this.loadingCtrl.create({
        spinner: "crescent",
        content:"Saindo..."
      });
     
      this.aluno.unsetAluno();
      this.contasChoose.unsetContas();
      this.loginService.logoff();
      this.clicked=false;
      loader.present();
      setTimeout(()=>{
        
       loader.dismiss();
        
        this.nav.setRoot('LoginPage');
      },1200);
      
    }
    
  
}
