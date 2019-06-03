import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, LoadingController } from 'ionic-angular';
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
  marcarTodosButtonClick = false;
  nullAlert = false  ;
  chamadaFromNavParams;
  chamada;
  chamadaParams;
  aula;
  alunos;
  subscriptions:Array<ISubscription> = [];
  profPhoto;
  cor;
  loader;
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
    private menu:MenuController,
    private loadingCtrl: LoadingController,
    ) {
      this.chamadaFromNavParams = navParams.get('chamada');
      console.log(this.chamadaFromNavParams);
      this.chamadaParams = {
        "codigoAula": this.chamadaFromNavParams.codigoAula, //'1039065',// 
        "base":  this.chamadaFromNavParams.base  //'CULTURA' ,//
      }
      this.cor =  this.chamadaFromNavParams.corEvento; //"grayEvent"; // 
      this.aula = this.chamadaFromNavParams; //this.chamadaParams;// 
      this.profPhoto = this.professor.getPhoto();
  }

  ionViewWillEnter(){
    
    this.menu.swipeEnable(false);
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    let pushParam = this.navParams.get('push');
    let reloadParam = this.navParams.get('reload');
    if(pushParam!=undefined){
      if(pushParam==true) {
        this.transitions.push();
        this.navParams.data = {push:false};
      }  
    } 
    if(reloadParam!=undefined){
      if(reloadParam==true) {
        this.navParams.data = {reload:false};
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
    let reload = this.navParams.get('reload');
    if(pushParam==undefined) this.transitions.back();
    else if(reload){
      this.subscriptions.forEach(
        subs=>{subs.unsubscribe();}
      );
    }
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
                  frequencia:aluno.frequencia
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
          setTimeout(()=>document.getElementById('status').classList.add(this.cor),300);
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

    marcarTodosButtonClickActivate(){
      this.marcarTodosButtonClick = true;
      
    }

    marcarTodosButtonClickDectivate(){
      setTimeout(()=>this.marcarTodosButtonClick=false,300);
    }

    realizarChamada(){
      this.createloader();
      this.loader.present();
     let realizarChamadaParam = {
       aula:this.aula,
       chamada:[]
     }
     Object.keys(this.alunosChamada).forEach(
       matricula=>{
         if(this.alunosChamada[matricula].frequencia == null) {
           this.nullAlert = true;
          }
         realizarChamadaParam.chamada.push(this.alunosChamada[matricula]);
        }
     );
     if(this.nullAlert == true){
      this.loader.dismiss();
      alert('Defina todos os alunos antes de enviar a chamada'); 
      this.nullAlert = false;
      
     }else{
      let url = env.BASE_URL;
      let urn = '/classe/chamada';
      this.http.specialPost(url,urn,realizarChamadaParam)
      .subscribe(
        data=>{
          this.loader.dismiss();
          this.navParams.data = {push:false , reload:true};
          this.navCtrl.push("ChamadaPage",{push:false,reload:true,chamada:this.chamadaFromNavParams});
          this.navCtrl.getActive().dismiss();
         
        }
      );
      
     }
     
       
      
    }

    setarFrequencia(value,matricula){
      this.alunosChamada[matricula].frequencia = value;
    }

    setarTodosPresentes(){
      
      Object.keys(this.alunosChamada).forEach(
        matricula=>{
          this.alunosChamada[matricula].frequencia = 'PRESENCA';

         }
      );
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
      setTimeout(()=>document.getElementById('status').classList.add(this.cor),300);
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

   
    createloader(){
    
      this.loader = this.loadingCtrl.create({
       spinner: "crescent",
       content:"Carregando..."
     });
     }
  }


