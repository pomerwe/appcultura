import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { ProfessorProvider, Turma } from '../../providers/professor/professor';
import { UtilServiceProvider } from '../../providers/util-service/util-service';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { environment as env } from '../../environments/environment';
import { DomSanitizer } from '../../../node_modules/@angular/platform-browser';
import * as __ from 'underscore';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { TransitionsProvider } from '../../providers/transitions/transitions';
import { NetworkCheckServiceProvider } from '../../providers/network-check-service/network-check-service';
/**
 * Generated class for the ProfessorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



@IonicPage()
@Component({
  selector: 'page-professor',
  templateUrl: 'professor.html',
})
export class ProfessorPage {
  turmasByFilial;
  filiais;
  errorMsg = false;
  noConnection = false;
  refresher;
  loading = false;
  loaded = false;
  constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        private MyApp: MyApp,
        private professor:ProfessorProvider,
        private util:UtilServiceProvider,
        private loginService:LoginServiceProvider,
        private http:HttpServiceProvider,
        private sanitizer:DomSanitizer,
        private localStorage:NativeStorage,
        private localStorageProvider:LocalStorageProvider,
        private transitions:TransitionsProvider,
        private menu:MenuController,
        private netCheck:NetworkCheckServiceProvider
      ) {
  }

  ionViewDidLoad() {
    
    this.loadProfessor(false);
  }

  ionViewWillEnter(){
    this.menu.swipeEnable(true);
  }

  loadProfessor(isRefresher){
    if(!isRefresher)this.loading = true;
    if(this.professor.loaded!=true){
    this.professor.setProfessor(this.loginService.getUserData());
    this.professor.loaded=true;
    }
    if(this.loaded!=true){

      this.professor.getProfessor()
    .subscribe(
      data=>{
        this.MyApp.nome=data.nome;
        this.MyApp.photoUrl =this.sanitizer.bypassSecurityTrustStyle(`url(${this.util.getFoto(data.photo)})`);
        this.MyApp.usuario = data.usuario;

        //Pega turmas do NativeStorage, se for null, chama a requisição ao servidor
        this.localStorage.getItem('turmas')
          .then(
            data=>{
              this.getTurmasFromLocalStorage();
            }
          )
          .catch(
            ()=>{
              this.getTurmas();
            }
          );
        
          
        
        

          }
        );
        this.loaded = true;
    }
    
    
  }

  //Função que pega as turmas do professor
  getTurmas(){

    

    let url= env.BASE_URL;
    let urn =  '/classe/turma';

    //Get especial que permite buscar de urls diferentes do schema movel
    this.http.specialGet(url,urn)
      .subscribe(
        data=>{
          //Função que adiciona turmas no array turmas do ProfessorProvider
          //e retorna um Array mais especifico dividindo as turmas por filial
          this.professor.pushToTurmas(data)
              .then(
                turmas=>{
                  this.loading = false;
                  if(this.refresher!=undefined)this.refresher.complete();
                  this.turmasByFilial = turmas;
                  this.filiais = this.professor.getFiliais();
                  this.filiais = __.sortBy(this.filiais,'filial');
                  this.localStorage.setItem('turmas',data);
                }
              );
          
        },
        error=>{
          if(!this.netCheck.check()) this.noConnection = true;
          else this.errorMsg = true;
          this.loading = false;
          if(this.refresher!=undefined) this.refresher.complete();
        }
      )
  }

  getTurmasFromLocalStorage(){
    
      this.localStorage.getItem('turmas')
        .then(
          turmas=>{
            this.professor.pushToTurmas(turmas)
              .then(
                turmas=>{
                  this.loading = false;
                  this.turmasByFilial = turmas;
                  this.filiais = this.professor.getFiliais();
                  this.filiais = __.sortBy(this.filiais,'filial');
                }
              )
          }
        )
    
  }
  

  pushTurmasPage(filial){
    let turmasDaFilial = this.turmasByFilial[filial];
    this.navCtrl.push("TurmasPage",{"turmasDaFilial":turmasDaFilial,"push":true});
  }

  //Função que faz refresh na página;
  doRefresh(refresher) {

    //Set a variável Refresher
    this.refresher = refresher;
    
    //Ao começar o Refresh, limpando as variável seguintes;
    this.professor.onTurmasRefresh();
    this.turmasByFilial = [];
    this.filiais = [];
    this.loaded = false;
    this.localStorage.remove('turmas');

    //Função que verifica, através do provider NetCheck, se o usuário possui conexão com a internet;
    if(!this.netCheck.check()){
      setTimeout(()=>{
        //Mostra a div de NoConnectionMessage top e some com a NoConnectionMessage bottom;
        this.noConnection = true;
        refresher.complete();
      },300);
      
    }
    else{
      //Some a div de NoConnectionMessage top
      this.noConnection = false;
      this.loadProfessor(true);

    

    } 
  }


}
