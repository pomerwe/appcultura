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
import * as __ from 'underscore';
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
  aula;
  alunos;
  subscriptions:Array<ISubscription> = [];
  profPhoto;
  cor;
  zoomPhoto = '';
  alunoZoomPhotoDiv= false;
  radioDisabled = false;
  alunosChamadaPattern  = [];
  alunosChamada;
  postChamadaParams;
  waiter;
  loading = false;
  realizarChamadaButtonClick = false;
  helpActive = false;
  mes = undefined;
  freqMeses = [];
  tab = 'chamada';


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
        "codigoAula": params.codigoAula, //'1039065',// 
        "base":  params.base  //'CULTURA' ,//
      }
      this.cor =  params.corEvento; //"grayEvent"; // 
      this.aula = params; //this.chamadaParams;// 
      console.log(params);
      this.profPhoto = this.professor.getPhoto();
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
    this.loading = true;
    let url = env.BASE_URL;
    let urn = '/classe/chamada';
    let params = this.chamadaParams;

    this.http.specialGet(url,urn,params)
      .subscribe(
        chamada=>{
          let alunos = [];
          console.log(chamada);
          chamada.forEach(
            aluno=>{
              
              let alunosChamadaPattern = 
                {
                  matricula:aluno.matricula,
                  chamada:aluno.frequencia
                }
              ;
              this.alunosChamadaPattern.push(alunosChamadaPattern);
              
              aluno.alunoNome = this.functions.nomes(aluno.alunoNome);
              alunos.push(aluno);
            }
            
          );
          this.alunosChamada = __.indexBy(this.alunosChamadaPattern,'matricula');
          this.chamada = alunos;
          this.loading = false;
          this.setFrequencias();
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
      'codigoTurma' :this.aula.codigoTurma,// //'122199', // 
      'base' : this.aula.base, //// 'CULTURA',// 
      'dataHoraInicio' : this.aula.dataHoraInicio //,// '2019-04-10T17:00:00'// 
    }
      this.subscriptions.push(this.http.specialGet(url,urn,params)
      .subscribe(
        aula =>{
          this.aula = aula;
          this.mes=aula.mes;
          if(this.aula.situacao.match("ABERTA")!==null){
            this.radioDisabled = false;
          }
          else{
            this.radioDisabled = true;
          }
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

    activeHelp(){
      this.helpActive = true;
    }

    deactiveHelp(){
     this.helpActive = false;
    }

    realizarChamadaButtonClickActivate(){
      this.realizarChamadaButtonClick = true;
      
    }

    realizarChamadaButtonClickDeactivate(){
      setTimeout(()=>this.realizarChamadaButtonClick=false,300);
    }

    realizarChamada(){
     let realizarChamadaParam = {
       aula:this.aula,
       chamada:[]
     }
     Object.keys(this.alunosChamada).forEach(
       chamada=>realizarChamadaParam.chamada.push(this.alunosChamada[chamada])
     )
     
     console.log(realizarChamadaParam);
       
      
    }

    setarChamada(value,matricula){
      this.alunosChamada[matricula].chamada = value;
    }

    showAlunoPhotoZoom(photoUrl){
      this.zoomPhoto = photoUrl;
      this.alunoZoomPhotoDiv = true;
    }

    closeAlunoPhotoZoom(){
      this.alunoZoomPhotoDiv = false;
      this.zoomPhoto = ''
    }

    setFrequencias(){
      if(this.mes!=undefined){
        if(this.mes<7){
          let meses = ['JAN','FEV','MAR','ABR','MAI','JUN'];
          this.freqMeses = meses;
        }
        else{
          let meses = ['JUL','AGO','SET','OUT','NOV','DEZ'];
          this.freqMeses = meses;
        }
      }
      else{
        setTimeout(()=>this.setFrequencias(),500);
      }
        
    }

    changeToDetails(){
      this.transitions.quickPush();
      this.tab = 'details';
      
    }

    changeToChamada(){
      this.transitions.quickBack();
      this.tab = 'chamada';
      
    }


    swipe(event){
    
    
      if(event.deltaX < 0){
        if(this.tab!='details'){
          this.changeToDetails();
        }
       
      }
      if(event.deltaX > 0){
        if(this.tab!='chamada'){
          this.changeToChamada();
        }
        
      }
    }
  }


