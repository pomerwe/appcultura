import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Navbar, AlertController } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { TranslateService } from '@ngx-translate/core';
import { TransitionsProvider } from '../../providers/transitions/transitions';
import { environment as ENV} from '../../environments/environment'
import { HttpServiceProvider } from '../../providers/http-service/http-service';
/**
 * Generated class for the LembrarSenhaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-lembrar-senha',
  templateUrl: 'lembrar-senha.html',
})
export class LembrarSenhaPage {

  @ViewChild(Navbar) navBar:Navbar; 
  email:string = '';
  emailInputLostFocus = false;
  recuperarSuccessMessage:string = '';
  recuperarSuccessMessageAgain:string = '';
  recuperarButtonEffect = false;
  loaderCarregandoLabel = '';
  loader;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private screenOrientation:ScreenOrientation,
    private menu:MenuController,
    private translate:TranslateService,
    private loadingCtrl:LoadingController,
    private transitions:TransitionsProvider,
    private http:HttpServiceProvider,
    private alert:AlertController
    ) {
      this.loadTranslatedVariables();
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent) => {
      this.navCtrl.pop({animate:false});
    };
    this.screenOrientation.lock("portrait");
    this.menu.swipeEnable(false);
  }
  ionViewWillEnter(){
    let pushParam = this.navParams.get('push');
    if(pushParam!=undefined){
      if(pushParam==true) {
        this.transitions.push();
        this.navParams.data = {push:false};
      }  
    } 

  }
  ionViewWillLeave(){
    this.transitions.back();
    this.screenOrientation.unlock();
    this.menu.swipeEnable(true);
  }

  recuperarButtonEffectClick(){
    this.recuperarButtonEffect = true;
    setTimeout(()=>this.recuperarButtonEffect = false,300);
  }

  recuperarSenhaRoutine(){
    this.presentLoader();
    this.recuperarSenhaRequest();
  }

  recuperarSenhaRequest(){
    let url = ENV.BASE_URL;
    let urn = '/remember';
    this.http.specialPost(url,urn,this.email)
      .subscribe(
        data=>{
          this.dismissLoader();
          console.log(data);
        }
      );
  }

  loadTranslatedVariables(){
    this.translate.get(['loader_carregando','recuperarsenha_reqsuccess','recuperarsenha_reqsuccessdenovo'])
          .subscribe(
            data => {
              this.loaderCarregandoLabel = data.loader_carregando;
              this.recuperarSuccessMessage = data.recuperarsenha_reqsuccess;
              this.recuperarSuccessMessageAgain = data.recuperarsenha_reqsuccessdenovo;
              this.createloader();
             
            }
          );
  }
  createloader(){

    this.loader = this.loadingCtrl.create({
      spinner: "crescent",
      content:this.loaderCarregandoLabel
    });
  }
  presentLoader(){
    this.loader.present();
  }
  dismissLoader(){
    this.loader.dismiss();
    this.createloader();
  }


  reqSuccess(which){
    if(which === 'success'){
      let alert = this.alert.create({
        title:'',
        message: this.recuperarSuccessMessage,
        buttons:[
          {text:'OK',role:'cancel'}
        ]
  
      });
      alert.present();
    }
    else if(which === 'successAgain'){
      let alert = this.alert.create({
        title:'',
        message: this.recuperarSuccessMessageAgain,
        buttons:[
          {text:'OK',role:'cancel'}
        ]
  
      });
      alert.present();
    }
    
    
  }
}
