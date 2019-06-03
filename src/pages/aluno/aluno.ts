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
  
  //Array de subscriptions
  subscriptions:Array<ISubscription> = [];

  //Variável objeto do aluno escolhido
  aluno;

  //Variável de controle da div buttonEffect1
  buttonEffect1 = false;

  //Variável de controle da div buttonEffect2
  buttonEffect2 = false;

  //Variável de controle da div buttonEffect3
  buttonEffect3 = false;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private transitions:TransitionsProvider,
    
    ) {
      this.aluno = this.navParams.get('aluno');/*{
        id: "CULTURA3391494", 
        base: "CULTURA", periodo: "2019/1", 
      filial: "BV", turma: "F2SS8A", idAluno: 16265,idPessoa: 17413,matricula: "106612",
      nome: "Isabela De Oliveira Resende Neves"
      ,photo: "http://app.culturabh.com.br:22001/public/photo/pessoa/17413"}

      */
  }

  ionViewWillLeave(){
    //Função que faz animação de retorno
    this.transitions.back();
    //Desescreve os subscribes feitos nessa page
    this.subscriptions.forEach(
      subs=>subs.unsubscribe()
    );
  }

  ionViewWillEnter(){
    //Verifica se no navparams chega o Push pra saber se fará ou não animação
    let pushParam = this.navParams.get('push');
    if(pushParam!=undefined){
      if(pushParam==true) {
        this.transitions.push();
        this.navParams.data = {push:false};
      }  
    } 
  }
  ionViewDidLoad() {
    //Desativa a animação padrão do ionic(para fins de usar a animação nativa do android)
    this.navBar.backButtonClick = (e:UIEvent) => {
      this.navCtrl.pop({animate:false});
    };
  }

  //Função que ativa o div buttonEffect pra efeito de click
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
