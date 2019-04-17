import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { Turma } from '../../providers/professor/professor';
import { TransitionsProvider } from '../../providers/transitions/transitions';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { environment as env } from '../../environments/environment';
import { UtilServiceProvider } from '../../providers/util-service/util-service';
import { Functions } from '../../functions/functions';
import { DomSanitizer } from '../../../node_modules/@angular/platform-browser';
import { NetworkCheckServiceProvider } from '../../providers/network-check-service/network-check-service';

/**
 * Generated class for the TurmaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-turma',
  templateUrl: 'turma.html',
})
export class TurmaPage {
  @ViewChild(Navbar) navBar:Navbar; 
  turma:Turma;
  getAlunosParams;
  alunos = [];
  loading = false;
  errorMsg = false;
  noConnection = false;
  refresher = undefined;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public transitions:TransitionsProvider,
    private http:HttpServiceProvider,
    private util:UtilServiceProvider,
    private functions:Functions,
    private sanitizer:DomSanitizer,
    private netCheck:NetworkCheckServiceProvider

  ) {

    this.turma = this.navParams.get('turma');
    console.log(this.turma);
  }

  ionViewWillLeave(){
    this.transitions.back();
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
    this.getAlunos(false);
  }

  setGetAlunosParams(){
    this.getAlunosParams = {
      "turma":this.turma.turma,
      "periodo":this.turma.codigoPeriodo,
      "filial":this.turma.siglaFilial
    }
  }

  getAlunos(isRefresher){
    if(!isRefresher)this.loading = true;
    
    let url= env.BASE_URL;
    let urn =  '/classe/matricula';
    this.setGetAlunosParams();
    let params = this.getAlunosParams;
    this.http.specialGet(url,urn,params)
      .subscribe(
        alunos=>{
          alunos.forEach(
            a=>{
              let aluno = {
                id:a.id,
                base:a.base,
                periodo:a.periodo,
                filial:a.filial,
                turma:a.turma,
                idAluno:a.idAluno,
                idPessoa:a.idPessoa,
                photo:this.util.getFotoPorPessoa(a.idPessoa),
                matricula:a.matricula,
                nome:this.functions.nomes(a.nome)
              };
              this.alunos.push(aluno);
              this.loading = false;
              if(this.refresher!=undefined)this.refresher.complete();
            }
          )
          
          console.log(alunos);

        },
        error=>{
          this.loading = false;
          if(this.refresher!=undefined)this.refresher.complete();
          if(!this.netCheck.check()) this.noConnection = true;
          else this.errorMsg = true;
          
          
        }
      )
  }

  getStylePhoto(url){
    let style = this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
    return style;
  }

  doRefresh(refresher) {

    //Set a variável Refresher
    this.refresher = refresher;
    
    //Ao começar o Refresh, limpando as variável seguintes;
    this.alunos = [];
    

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
      this.getAlunos(true);

    

    } 
  }

  enableRefresh(event){
    console.log(event);
  }
}
