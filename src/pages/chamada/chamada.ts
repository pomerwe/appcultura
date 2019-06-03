import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, LoadingController } from 'ionic-angular';
import { TransitionsProvider } from '../../providers/transitions/transitions';
import { ISubscription } from 'rxjs/Subscription';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import {environment as env} from '../../environments/environment'
import { ProfessorProvider } from '../../providers/professor/professor';
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

  //Variável que controla a div do efeito do botão de marcar todos
  marcarTodosButtonClick = false;

  //Variável que define se o alert de "todos devem estar marcados" aparecerá
  nullAlert = false  ;

  //Variável que vai receber chamada do navParams
  chamadaFromNavParams;

  //Variável que vai receber a chamada
  chamada;

  //Parâmetros pra enviar na requisição de chamada
  chamadaParams;

  //Variável que vai receber a aula
  aula;

  //Variável que lista os alunos na chamada
  alunos;

  //Array de subscriptions
  subscriptions:Array<ISubscription> = [];

  //Url da foto do professor
  profPhoto;

  //Cor do status da chamada
  cor;

  //Variável que receberá um loader
  loader;

  //Vai receber a url da foto do aluno que dará zoom;
  zoomPhoto = '';
  
  //Controla a div de zoom de foto
  alunoZoomPhotoDiv= false;

  //Controla os radio buttons da chamada
  radioDisabled = false;

  /*Array que servirá de padrão pra aplicar o indexBy da biblioteca underscore 
  (aqui no caso, pra poder usar o array alunosChamada puxando pela matricula. ex: alunosChamada[59245].frequencia)
  */

  alunosChamadaPattern  = [];
  //Array que receberá os alunos da requisição chamada de forma com que os valores poderão 
  //ser acessado através da matrícula;
  alunosChamada;

  //Parametros que serão enviados pra realizar a chamada
  postChamadaParams;

  //Variáfvel de controle do gif de loading
  loading = false;

  //Variável de controle do efeito do botão de realizar chamada
  realizarChamadaButtonClick = false;

  //Variável de controle da div de help;
  helpActive = false;

  //Variável que representa o mês da aula escolhida
  mes = undefined;

  //Array de meses de frequência do semestre
  freqMeses = [];

  //Variável que controla a tab mostrada
  tab = 'chamada';


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,

    //Classe de serviço que executa animações de transição nativas
    private transitions:TransitionsProvider,
    private http:HttpServiceProvider,

    //Classe de serviço de professor (mantém variáveis globais com os dados do professor)
    private professor:ProfessorProvider,
    private util:UtilServiceProvider,

    //Classe provider com algumas funções de utilidade
    private functions:Functions,

    //Plugin nativo do cordova que gerencia orientação de tela
    private screenOrientation: ScreenOrientation,
    private menu:MenuController,

    //Controller do alert de loading
    private loadingCtrl: LoadingController,
    ) {
      //Seta a variável com os dados que vem no navParams
      this.chamadaFromNavParams = navParams.get('chamada');

      //Seta a variável de parâmetros a serem enviados na requisição
      this.chamadaParams = {
        "codigoAula": this.chamadaFromNavParams.codigoAula, //'1039065',// 
        "base":  this.chamadaFromNavParams.base  //'CULTURA' ,//
      }

      //Seta a cor do STATUS da chamada
      this.cor =  this.chamadaFromNavParams.corEvento; //"grayEvent"; // 

      //Seta a variável aula com os parâmetros pra requisição em getTurmas()
      this.aula = this.chamadaFromNavParams; //this.chamadaParams;// 

      //Pega a foto do professor do serviço professor.ts
      this.profPhoto = this.professor.getPhoto();
  }

  ionViewWillEnter(){
    //Proibe que o menu seja aberto
    this.menu.swipeEnable(false);

    //Trava a orientação da tela pra PORTRAIT
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    //Aqui em baixo ocorre validação de animação da tela 
    //se vai ou não fazer animação e qual tipo de animação vai ser(ou ida ou retorno)
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
    
    //Cancela a animação padrão feita pelo Ionic ao clickar no botão de retorno
    this.navBar.backButtonClick = (e:UIEvent) => {
      this.navCtrl.pop({animate:false});
    };
    this.getChamada();
    this.getTurma();
  }

  ionViewWillLeave(){
    //Ao sair da viww permite que o menu seja aberto novamente
    this.menu.swipeEnable(true);

    //Ao sair da view permite que a tela troque de orientação
    this.screenOrientation.unlock();

    //Em baixo rola uma validação de qual animação será executada e se será executada
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
    //Ativa a div de loading que mostrará um gif de carregamento
    this.loading = true;

    let url = env.BASE_URL;
    let urn = '/classe/chamada';
    let params = this.chamadaParams;

    this.http.specialGet(url,urn,params)
      .subscribe(
        chamada=>{
          //Array que vai receber os alunos da requisição
          let alunos = [];
          
          chamada.forEach(
            aluno=>{
              //Padrão criado pra colocar no array alunos
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
          /*Função que recebe os valores de alunosChamadaPattern indexados pela matricula 
           ex: alunosChamadaPattern[4] = matricula:59245 , frequencia: null => vai virar
           alunosChamada[59245] = matricula:59245 , frequencia: null 
           ESSA É A VARIÁVEL QUE REALIZA A CHAMADA
           */
          this.alunosChamada = __.indexBy(this.alunosChamadaPattern,'matricula');

          //Variável que vai mostrar os alunos no html
          this.chamada = alunos;

          //Esconde a div de loading
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

    //Seta a variavel de freqMeses que mostrará as frequencias dos alunos
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

    //Troca a tab pra tab de detalhe dos alunos
    changeToDetails(){
      //Faz uma animação de ida
      this.transitions.quickPush();
      this.tab = 'details';
      
    }

    //Troca a tab pra tab de chamada dos alunos
    changeToChamada(){
      //Faz uma animação de volta
      this.transitions.quickBack();
      this.tab = 'chamada';
      setTimeout(()=>
      //Seta a cor do STATUS na tab chamada
      document.getElementById('status').classList.add(this.cor)
      ,300);
    }

    //Evento que detecta o movimento de swipe do dedo
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

   //Cria um alert de loading
    createloader(){
    
      this.loader = this.loadingCtrl.create({
       spinner: "crescent",
       content:"Carregando..."
     });
     }
  }


