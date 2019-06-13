import { Component, ViewChild,} from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import * as __ from 'underscore';
import { TransitionsProvider } from '../../providers/transitions/transitions';
import { MenuController } from '../../../node_modules/ionic-angular/components/app/menu-controller';
import { Platform } from 'ionic-angular/platform/platform';
import { MyApp } from '../../app/app.component';
/**
 * Generated class for the TurmasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-turmas',
  templateUrl: 'turmas.html',
})
export class TurmasPage {
  @ViewChild(Navbar) navBar:Navbar; 
  filial;
  turmas:Array<any>;
  errorMsg = false;
  noConnection = false;
  communicationComponent = false;
  communicationTurma = {};
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private transitions:TransitionsProvider,
    private menu:MenuController,
    private platform:Platform,
    private myApp:MyApp
  ) {

    let turmasDaFilial = navParams.get('turmasDaFilial');
    this.filial = turmasDaFilial.filial;
    this.turmas = turmasDaFilial.turmas;
    console.log(this.turmas);
    this.turmas = __.sortBy(this.turmas,'curso');
    
  }

  ionViewWillEnter(){
    this.platform.registerBackButtonAction(()=>{
      if(this.communicationComponent == true){
        this.communicationComponent = false;
      }
      else{
        this.navCtrl.pop({animate:false});
      }
    });
    
    let pushParam = this.navParams.get('push');
    if(pushParam!=undefined){
      if(pushParam==true) {
        this.transitions.push();
        this.navParams.data = {push:false};
      }  
    } 
  }

  ionViewDidLoad() {
    
    this.navBar.backButtonClick = (e:UIEvent) => {
      this.navCtrl.pop({animate:false});
    };
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave(){
    this.myApp.resetBackButtonActions();
    let pushParam = this.navParams.get('push');
    if(pushParam==undefined) this.transitions.back();
    else if(pushParam!=true) this.transitions.back();
        
  }

  pushTurmaPage(turma){
    
    this.navCtrl.push("TurmaPage",{"turma":turma,"push":true});
  }

  scrollLock(boolean){
    if(boolean == false){
      document.getElementById('ioncontent').children[1].classList.remove('noScroll');
    }
    else{
      document.getElementById('ioncontent').children[1].classList.add('noScroll');
    }
  }

  see(t){
    console.log(t);
  }
 
  
}
