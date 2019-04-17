import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, InfiniteScroll, LoadingController } from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { ContasChooseProvider } from '../../providers/contas-choose/contas-choose';
import 'rxjs/add/operator/toPromise';
import { AlunoProvider } from '../../providers/aluno/aluno';
import { MyApp } from '../../app/app.component';
import { UtilServiceProvider } from '../../providers/util-service/util-service';
import { ISubscription } from '../../../node_modules/rxjs/Subscription';
import { NetworkCheckServiceProvider } from '../../providers/network-check-service/network-check-service';
import { Functions } from '../../functions/functions';
import * as __ from 'underscore';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { AutoReloadDiaDiaProvider } from '../../providers/auto-reload-dia-dia/auto-reload-dia-dia';
import { NativePageTransitions } from '../../../node_modules/@ionic-native/native-page-transitions';
/**
 * Generated class for the FeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 //Variável do tipo Chamada, que vem da API
 export class Chamada{
  id:number;
  matricula: string;
  data: Date;
  horario: string;
  codperlet: string;
  nome: string;
  periodo: string;
  freq: string;
  descricao: string;
  tarefasdia: string;
  codtur: string;
    
 }

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

 

  //Variável array que carrega objetos Chamada;
  chamadas: Array<Chamada>;

  //Variável que controla o component Ionic Refresher. Posteriormente é set
  refresher;
  
  //Variável que controla a Page do Pageable que vem da API
  page = 0;

  //Variável que controla o component Ionic Infinite Scroll
  infiniteScroll:any ;

  //Parametros para a URI do Dia-Dia
  diaDiaParam;

  //Variável que representa a matrícula do aluno selecionado nessa página
  matricula;

  //Variável que controla a Div NoConnectionMessage que fica no top. 
  //Uma div que contém uma mensagem de "Sem conexão à internet"
  noConnectionTop = false;

  //Variável que controla a div NoConnectionMessage que fica no bottom
  //Uma div que contém uma mensagem de "Sem conexão à internet"
  noConnectionBot = false;

  

  //Variável que armazena as subscrições de variáveis Observables
  //para posteriormente as subscrições serem canceladas
  subscriptions:Array<ISubscription> = [];
  

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private http:HttpServiceProvider,
    private loginService:LoginServiceProvider,
    private contasChoose:ContasChooseProvider,
    private aluno:AlunoProvider,
    private MyApp:MyApp,
    public loadingCtrl: LoadingController,
    private util:UtilServiceProvider,
    private netCheck:NetworkCheckServiceProvider,
    private functions:Functions,
    private autoReload:AutoReloadDiaDiaProvider,
    private sanitizer: DomSanitizer,
    private nativePageTransitions: NativePageTransitions,
    
    
    ) {
   
  
  }
      // Função que cria um loader na página;
      loader = this.loadingCtrl.create({
      spinner: "crescent",
      content:"Carregando..."
    });


    
    
  
  ionViewWillEnter(){
   
  }
   ionViewDidLoad() {

    this.MyApp.carregarContas();  

    /*Função que abre uma lista de contas caso o usuário tenha mais 
    de um dependente ou não tenha escolhido uma conta ainda*/
    if(this.contasChoose.check==false){
      this.autoReload.carregarVariaveis();
      
      /*Função, do provider ContasChoose, que carrega todas as contas vinculadas 
      ao usuario e faz um alert solicitando que escolha qual conta irá consultar. 
      Caso haja apenas 1 conta vinculada, o alert não é mostrado.*/
      this.contasChoose
      .contasChoose()
      .then(
        data=>{
          //Set o aluno escolhido no provider Aluno
          this.aluno.setAluno(data);

          //Chama o aluno que foi set.
          this.aluno.getAluno()
          .then(
            data=>{
             
              //A seguir temos uma sequência de sets nas variáveis do Menu;
              this.MyApp.photoUrl = this.sanitizer.bypassSecurityTrustStyle(`url(${this.util.getFoto(data.photo)})`);
              this.MyApp.nome = data.nome;
              this.MyApp.matricula = data.matricula;
              this.MyApp.usuario = data.usuario;      
              
              //Set na variável matrícula desta página
              this.setMatricula(data.matricula);
              this.loader.present();
              
              this.setChamadas(data);
              
              
              
              
            },
            error=>{
              console.log(error);
            }
          );
        }
      );
    }
    else{
      console.log(this.MyApp.photoUrl);
      this.setMatricula(this.aluno.getMatricula());
      this.loader.present();
      this.getDiaDia();
    }
  
   
    

  }

  ionViewWillLeave(){

    
    //Função que itera a variável subscriptions, dando Unsubscribe 
    //em todos os Observables que foram Subscribe   
    this.subscriptions.forEach(
      subs=>{subs.unsubscribe();}
    );
  }
 
 //Funçaõ que define os parametros para a URI dia-dia
  setDiaDiaParam(){
    this.diaDiaParam = {
      'page':this.getPage(),
      'matricula':this.aluno.getMatricula(),
      'size':10,
      'example':'',
      'sort':'data,desc'
    }
  }

  
  
  
 
  getDiaDia(){
    this.setDiaDiaParam();
    let urn = '/dia-dia';
    this.subscriptions.push(
      //Requisição HTTP dos dados do Dia-Dia
      this.http.get(urn,this.diaDiaParam).subscribe(

      data =>{ 
        this.chamadas = data.content;

        //sortBy é uma função da Library Underscore(foda pra caralho!!), nela você encontrará uma imensa gama de utilidades;
        //Essa função organiza de forma Crescente os dados da variável de acordo com o parâmetro que passar
        //Reverse apenas reverte os Indexes do Array. Deixa ele ao contrário;  
        this.chamadas = __.sortBy(this.chamadas, 'data').reverse();        
        this.loader.dismiss();
        if(this.refresher!=undefined){
          this.refresher.complete();
        }
      },
      error =>{
        if(!this.netCheck.check()){
        setTimeout(()=>{
        this.noConnectionBot = false;
        this.noConnectionTop = true;
        this.refresher.complete();
         },300);
         
      }
      this.subscriptions.forEach(subs=>{subs.unsubscribe()});
      }

    ));
  

    

  }
  autoReloadRoutine(){
    setTimeout(()=>{
      this.autoReload.autoReload();
      this.aluno.getAluno()
        .then(
          data=>{
            console.log(data);
            this.setChamadas(data);
          }
      );
    },600000);
  }

  setChamadas(data){
    this.chamadas = this.autoReload.getDiaDiaByMatricula(data.matricula);
    this.chamadas = __.sortBy(this.chamadas,'data').reverse();
    setTimeout(()=>{if(this.chamadas.length==0){
      this.setChamadas(data);
    }
    else{ 
        this.autoReloadRoutine();
        this.loader.dismiss();
      }
    },500);
  }
  setPage(page){
    this.page = page;

  }
  getPage():number{
    return this.page;
  }
  setMatricula(matricula){
    this.matricula = matricula;

  }
  getMatricula():number{
    return this.matricula;
  }



 



  //Função que faz refresh na página;
  doRefresh(refresher) {

   //Set a variável Refresher
   this.refresher = refresher;
    
   //Ao começar o Refresh, limpando a variável chamadas;
    while(this.chamadas.length){
      this.chamadas.pop();
    }

    //Ao dar Refresh, set o parâmetro página, que irá para requisição, para 0;
    this.setPage(0);

    //Função que verifica, através do provider NetCheck, se o usuário possui conexão com a internet;
    if(!this.netCheck.check()){
      setTimeout(()=>{
        //Mostra a div de NoConnectionMessage top e some com a NoConnectionMessage bottom;
        this.noConnectionTop = true;
        this.noConnectionBot = false;
        refresher.complete();
      },300);
      
    }
    else{
      //Some a div de NoConnectionMessage top
      this.noConnectionTop = false;
      this.aluno.getAluno()
      .then(
        data=>{
          this.setMatricula(data.matricula);
          this.getDiaDia();
        },
        error =>{
          
        }
      );

    

    if(this.infiniteScroll!=undefined){
      this.infiniteScroll.enable(true);
    }
    } 
  }

  //Função que faz infine scroll na página;
   doInfinite(infiniteScroll: InfiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    if(!this.netCheck.check()){
      setTimeout(()=>{
      this.noConnectionBot = true;
      this.noConnectionTop = false;
      infiniteScroll.complete();
       },300);
    }

    else{
      this.noConnectionBot = false;
    if(this.getPage()==0){
      this.setPage(1);
    }    
    this.setDiaDiaParam();
    let uri = '/dia-dia';
    
    this.subscriptions.push(
      //Requisição HTTP personalisada para o Infinite Scroll, para a URN dia-dia
      this.http.get(uri,this.diaDiaParam).subscribe(
          data => 
          {
            data.content.forEach(chamada => {
              this.chamadas.push(chamada);
            });
            //Variável que recebe da requisição se é ou não a última página
            let last:boolean = data.last;
            this.setPage(data.number+1);

            //Se é a última página, desabilita o infinite scroll
            infiniteScroll.complete();

            if (last == true) {
              infiniteScroll.enable(false);
            }
          },
          error => {
            //Caso não haja conexão com a Internet, mostra a div NoConnectionMessage no Bottom da página
            if(!this.netCheck.check()){
              setTimeout(()=>{
              this.noConnectionBot = true;
              this.noConnectionTop = false;
              infiniteScroll.complete();
               },300);
            }
            this.subscriptions.forEach(s=>{s.unsubscribe()});

          }));
        
  }
  }

  
  //Função do provider functions, que estiliza a barra de rolagem
  scrollActive(event){
    this.functions.scrollActive(event);
    
  }
  //Função do provider functions, que estiliza a barra de rolagem
  scrollInactive(event){
    this.functions.scrollInactive(event);
  }

  
  
}
