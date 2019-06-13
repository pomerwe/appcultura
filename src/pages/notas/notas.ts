import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, MenuController, Navbar } from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { Functions } from '../../functions/functions';
import { AlunoProvider } from '../../providers/aluno/aluno';
import { ISubscription } from '../../../node_modules/rxjs/Subscription';
import * as __ from 'underscore';
import { TransitionsProvider } from '../../providers/transitions/transitions';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the NotasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notas',
  templateUrl: 'notas.html',
})
export class NotasPage {

  
  @ViewChild(Navbar) navBar:Navbar; 

  loaderCarregandoLabel = '';

  //Parâmetros que serão enviados na requisição para URN cursos
  cursosParams;

  //Representa a matrícula selecionada nessa page
  matricula;

  //Representa o codperlet selecionado no momento na page
  codperlet;

  //Armazena todos os codperlets buscados na API que o aluno já estudou na Cultura
  codperlets = [];

  //Variável que controla qual bimestre será mostrado na página
  bimestre=0;

  //Array de bimestres
  bimestres=[
    {bimestre:'1º', value:0},
    {bimestre:'2º', value:1},
    {bimestre:'Notas Finais',value:2}
  ]

  //Rpresenta o nome do aluno na page
  nome;

  //Variável que armazena a lista de notas que o aluno obteve nas demais avaliações durante o semestre
  notasConceitoList;

  //Variável que vai mostrar as notas de acordo com o bimestre selecionado
  notasConceito;

  //Array de cursos que estão sendo cursados junto com seus respectivos codperlets
  cursos =[];

  //Curso selecionado no combobox
  curso;

  //Representa o idmatriculaperlet do curso selecionado no combobox
  idmatriculaperlet;

  //Array com todas as notas do primeiro bimestre
  provasNotas1;

  //Array com a nota final do primeiro bimestre
  notaFinalB1;

  //Array com todas as notas do segundo bimestre
  provasNotas2;

  //Array com a nota final do seungo bimestre
  notaFinalB2;

  //Array com os labels traduzidos das notas finais
  notasFinaisTitles = [];

  //Array com todas as notas finais
  provasNotasFinais;

  //Array com todas a nota final juntando todos os conceitos
  notaFinal;

  //Será set com um loader
  loader;

  //Variável que armazena subscrições de Observables
  subscriptions:Array<ISubscription> = [];

  bimestreCLicked;
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams , 
    private http:HttpServiceProvider , 
    private functions:Functions,
    private alunos:AlunoProvider,
    private loadingCtrl:LoadingController,
    private menu:MenuController,
    private transitions:TransitionsProvider,
    private translate:TranslateService
  
  ) {
  }
  ionViewWillEnter(){
    this.loadTranslatedVariables();
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

    //Bloquea a interação com o menu
    this.menu.swipeEnable(false);

    //Função que chama os dados do aluno selecionado
    this.alunos.getAluno2()
    .subscribe(
      data=>{
        //Aqui o nome é transformado de CapsLock pra normal
        this.nome =this.functions.nomes(data.nome);
        this.matricula=data.matricula;
      }
    )
    
  }
  ionViewWillLeave(){
    this.transitions.back();
    this.menu.swipeEnable(true);
    this.subscriptions.forEach(
      subs=>{subs.unsubscribe();}
    );
  }
  carregarDados(){
    this.loader.present();
    let uri = '/codperlet';
    let param = {
      'matricula':this.matricula,
      'example':'',
      'sort':'codperlet,desc'

    };
    this.getCodperlet(uri,param);
   

  }

  //Função que vai fazer a requisição à api buscando os codperlets que o aluno já esteve na Cultura
  getCodperlet(uri,param){
    this.subscriptions.push(this.http.get(uri,param)
    .subscribe(
      codperlet =>{
        
        //Função Underscore que tira duplicações de acordo com o parâmetro passado
        this.codperlets = __.uniq(codperlet,'codperlet');
        
        //Auto-seleciona o primeiro codperlet da lista de codperlets, que vêm de forma decrescente.
        if(this.codperlet == undefined){
          this.codperlet = this.codperlets[0].codperlet;

        }
        let uri = '/cursos';
        this.setCursosParam( this.matricula,this.codperlet);

      
        this.getCursosList(uri , this.cursosParams);
    }
      ,
      error=>{console.log(error);}

    ));
  }

  //Requisção HTTP à api buscando a lista de cursos que o aluno está cursando em determinado codperlet
  getCursosList(uri,params){
   this.subscriptions.push(
     this.http.get(uri,params)
        .subscribe(
          cursos =>{
          this.cursos = cursos; 
          //Pega o idmatriculaperlet do primeiro curso da lista caso não esteja definido
          if(this.idmatriculaperlet == undefined || this.idmatriculaperlet == null){ this.idmatriculaperlet = cursos[0].id}
          let uri =`/notas/${this.idmatriculaperlet}`;
          this.getNotasConceito(uri);
        },
          error=>{console.log(error)}
  )); 
}

//requisição HTTP à api buscando a lista de notas que o aluno obteve 
//durante todo o codperlet referente à um idmatriculaperlet
getNotasConceito(uri):any{
  this.subscriptions.push(this.http.get(uri)
  .subscribe(
    notasConceito=>{
      this.notasConceito = notasConceito;
      this.provasNotas1 = [
      {prova:'Revision Test', conceito: this.notasConceito.revision},
      {prova:'Speaking Skills', conceito: this.notasConceito.speaking1},
      {prova:'Writing Skills', conceito: this.notasConceito.writing1}, 
      {prova:'Listening Skills', conceito: this.notasConceito.listening1},
      {prova:'Reading Skills', conceito: this.notasConceito.reading1}
  ]   
      this.notaFinalB1={prova:this.notasFinaisTitles['notabimestre'], conceito: this.notasConceito.bimestre1};

    this.provasNotas2 = [
      {prova:'Quick Review', conceito: this.notasConceito.quick}, 
      {prova:'Speaking Skills', conceito: this.notasConceito.speaking2},
      {prova:'Writing Skills', conceito: this.notasConceito.writing2}, 
      {prova:'Listening Skills', conceito: this.notasConceito.listening2},
      {prova:'Reading Skills', conceito: this.notasConceito.reading2}
    ]  
    this.notaFinalB2={prova:this.notasFinaisTitles['notabimestre'], conceito: this.notasConceito.bimestre2}; 

    this.provasNotasFinais =[
      {prova:'Writing Final', conceito: this.notasConceito.writingfinal},
      {prova: 'Oral Final', conceito: this.notasConceito.oralfinal},  
      {prova:'Use of English', conceito: this.notasConceito.useofenglish}       

    ]
    this.notaFinal={prova:this.notasFinaisTitles['notafinal'], conceito: this.notasConceito.notafinal}  ;
    this.loader.dismiss();
    this.createloader();
    },
    error=>{console.log(error)}
  ));


}

//Função que set os parâmtros pra requisição em cursos
setCursosParam(matricula,codperlet){
  this.cursosParams = {
    'matricula':matricula,
    'codperlet':codperlet,
    'example':''
  };
}

//função que instancia um loader na variável loader
createloader(){
    
  this.loader = this.loadingCtrl.create({
   spinner: "crescent",
   content:this.loaderCarregandoLabel
 });
 }


 setBimestre(bimestre,value){
   
  if(this.bimestreCLicked==undefined){
    let element = document.getElementsByClassName('clicked')[0];
    element.classList.remove('clicked');
  }
  if(this.bimestreCLicked!=undefined) this.bimestreCLicked.classList.remove('clicked');
  bimestre.classList.add('clicked');
  if(this.bimestre < value){
    let element = document.getElementsByClassName('tabelaNotasDiv')[0];
    element.classList.remove('animation2');
    element.classList.remove('animation1');
    element.classList.remove('animation4');
    element.classList.remove('animation3');
    if(this.bimestre==1 && value==2)element.classList.add('animation4');
    else element.classList.add('animation2');
   
  }
  else if(this.bimestre == value){}
  else{
    let element = document.getElementsByClassName('tabelaNotasDiv')[0];
    element.classList.remove('animation1');
    element.classList.remove('animation2');
    element.classList.remove('animation4');
    element.classList.remove('animation3');
    if(this.bimestre==1 && value==0)element.classList.add('animation3');
    else element.classList.add('animation1');
    
  }
  this.bimestre = value;
  this.bimestreCLicked = bimestre;
 }

 swipe(event){
    let elements = document.getElementsByClassName('bimestres');
   if(event.deltaX<0){
     
    if(this.bimestre == 2){}
    else this.setBimestre(elements[this.bimestre+1],this.bimestre + 1);
    }
   else{
     if(this.bimestre == 0){}
     else this.setBimestre(elements[this.bimestre-1],this.bimestre - 1);
  }
 }

 loadTranslatedVariables(){
  this.translate.get(['loader_carregando','notas_notabimestre','notas_notafinal'])
        .subscribe(
          data => {
            this.loaderCarregandoLabel = data.loader_carregando;
            this.notasFinaisTitles['notabimestre'] = data.notas_notabimestre;
            this.notasFinaisTitles['notafinal'] = data.notas_notafinal;
            this.createloader();
            this.carregarDados();
          }
        );
    }
}



























