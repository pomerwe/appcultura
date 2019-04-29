import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { TransitionsProvider } from '../../providers/transitions/transitions';
import { ISubscription } from 'rxjs/Subscription';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import {environment as env} from '../../environments/environment'
import { ProfessorProvider } from '../../providers/professor/professor';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilServiceProvider } from '../../providers/util-service/util-service';
import { Functions } from '../../functions/functions';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
/**
 * Generated class for the ChamadaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chamada',
  templateUrl: 'chamada.html',
})
export class ChamadaPage {
  @ViewChild(Navbar) navBar:Navbar; 
  chamada;
  chamadaParams;
  turma;
  alunos;
  subscriptions:Array<ISubscription> = [];
  profPhoto;
  cor;
  helpActive = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private transitions:TransitionsProvider,
    private http:HttpServiceProvider,
    private professor:ProfessorProvider,
    private sanitizer:DomSanitizer,
    private util:UtilServiceProvider,
    private functions:Functions,
    private screenOrientation: ScreenOrientation,
    private menu:MenuController
    ) {
      let params = navParams.get('chamada');
      this.chamadaParams = {
        "codigoAula": '1039065', //params.codigoAula,
        "base": 'CULTURA' , //params.base
      }
      console.log(params);
      this.cor = "grayEvent";//params.corEvento;
      this.turma = this.chamadaParams //params;
      this.profPhoto = this.professor.getPhoto();
      console.log(this.profPhoto);
      console.log(this.turma);
  }

  ionViewWillEnter(){
    
    this.menu.swipeEnable(false);
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    let pushParam = this.navParams.get('push');
    if(pushParam!=undefined){
      if(pushParam==true) {
        this.transitions.push();
        this.navParams.data = {push:false};
      }  
    } 
  }
  
  ionViewDidLoad() {
    
    //Cancela a animação feita pelo Ionic
    this.navBar.backButtonClick = (e:UIEvent) => {
      this.navCtrl.pop({animate:false});
    };
    this.getChamada();
    this.getTurma();
  }

  ionViewWillLeave(){
    
    this.menu.swipeEnable(true);
    this.screenOrientation.unlock();
    let pushParam = this.navParams.get('push');
    if(pushParam==undefined) this.transitions.back();
    else if(pushParam!=true) this.transitions.back();
    this.subscriptions.forEach(
      subs=>{subs.unsubscribe();}
    );
  }


  getChamada(){

    let url = env.BASE_URL;
    let urn = '/classe/chamada';
    let params = this.chamadaParams;

    this.http.specialGet(url,urn,params)
      .subscribe(
        chamada=>{
          console.log(chamada);
          let alunos = [];
          chamada.forEach(
            aluno=>{
              aluno.alunoNome = this.functions.nomes(aluno.alunoNome);
              alunos.push(aluno);
            }
          );
          this.chamada = alunos;
          
        },
        error=>{
          console.log(error);
        }
      )
  }

  getTurma(){
    let url = env.BASE_URL;
    let urn = '/classe/aula';
    let params = {
      'codigoTurma' : '122199', //this.turma.codigoTurma,
      'base' : 'CULTURA',// this.turma.base,
      'dataHoraInicio' :'2019-04-10T17:00:00',// this.turma.dataHoraInicio
    }
      this.subscriptions.push(this.http.specialGet(url,urn,params)
      .subscribe(
        turma =>{
          this.turma = turma;
          console.log(this.turma);
          document.getElementById('status').classList.add(this.cor);
        }
        
      ))
    }

    photo(photo){
      return this.util.getFoto(photo); //this.sanitizer.bypassSecurityTrustStyle(`url(${})`); ;
    
    }

    getPhotoUrl(photo){
      return this.util.getFotoPorPessoa(photo);
    }

    activeHelp(scrollContent){
      scrollContent.classList.add('helpActive');
      this.helpActive = true;
    }

    deactiveHelp(scrollContent){
      scrollContent.classList.remove('helpActive');
      this.helpActive = false;
    }
  }


