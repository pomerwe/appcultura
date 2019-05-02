import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { TransitionsProvider } from '../../providers/transitions/transitions';
import { NavigationBar } from '@ionic-native/navigation-bar';
import { ISubscription } from 'rxjs/Subscription';

/**
 * Generated class for the AlunoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-aluno',
  templateUrl: 'aluno.html',
})

export class AlunoPage {
  @ViewChild(Navbar) navBar:Navbar; 
  subscriptions:Array<ISubscription> = [];
  aluno;
  buttonEffect1 = false;
  buttonEffect2 = false;
  buttonEffect3 = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private transitions:TransitionsProvider,
    
    ) {
      this.aluno = {
        id: "CULTURA3391494", 
        base: "CULTURA", periodo: "2019/1", 
      filial: "BV", turma: "F2SS8A", idAluno: 16265,idPessoa: 17413,matricula: "106612",
      nome: "Isabela De Oliveira Resende Neves"
      ,photo: "http://app.culturabh.com.br:22001/public/photo/pessoa/17413"}

      //this.navParams.get('aluno');
      console.log(this.aluno);
  }

  ionViewWillLeave(){
    this.transitions.back();
    this.subscriptions.forEach(
      subs=>subs.unsubscribe()
    );
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
  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent) => {
      this.navCtrl.pop({animate:false});
    };
  }

  button(buttonEffect){
    if(buttonEffect.match('buttonEffect1')){ 
      this.buttonEffect1 = true ; 
      setTimeout(()=>this.buttonEffect1=false,
      600);
    }
    else if(buttonEffect.match('buttonEffect2')){ 
      this.buttonEffect2 = true ; 
      setTimeout(()=>this.buttonEffect2=false,
      600);
    }
    else if(buttonEffect.match('buttonEffect3')){
      this.buttonEffect3 = true ; 
      setTimeout(()=>this.buttonEffect3=false,
      600);} 
    
  }
}
