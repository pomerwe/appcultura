import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { Functions } from '../../functions/functions';
import { AlunoProvider } from '../../providers/aluno/aluno';

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
  notasCursosParams;
  matricula;
  codperlet;
  codperlets = [];
  bimestre=0;
  bimestres=[
    {bimestre:'1º', value:0},
    {bimestre:'2º', value:1},
    {bimestre:'Notas Finais',value:2}
  ]
  nome;
  notasConceitoList;
  notasConceito;

  cursos =[];
  curso;
  idmatriculaperlet;

  provasNotas1;
  notaFinalB1;
  provasNotas2;
  notaFinalB2;
  provasNotasFinais;
  notaFinal;
  loader;

  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams , 
    private http:HttpServiceProvider , 
    private functions:Functions,
    private alunos:AlunoProvider,
    private loadingCtrl:LoadingController) {
  }

  ionViewDidLoad() {
    this.alunos.getAluno2()
    .subscribe(
      data=>{
        console.log(data);
        this.nome =this.functions.nomes(data.nome);
        this.matricula=data.matricula;
      }
    )
    this.carregarDados();
  }

  carregarDados(){
    //47874 , 59245 ,114023
    this.createloader();
    this.loader.present();
    let uri = '/codperlet';
    let param = {
      'matricula':this.matricula,
      'example':'',
      'sort':'codperlet,desc'

    };
    this.getCodperlet(uri,param);
   

  }

  getCodperlet(uri,param){
    this.http.get(uri,param)
    .subscribe(
      codperlet =>{
        
        this.codperlets = codperlet;
        
        if(this.codperlet == undefined){
          this.codperlet = this.codperlets[0].codperlet;

        }
        let uri = '/cursos';
        this.notasCursosParams = {
          'matricula':this.matricula,
          'codperlet':this.codperlet,
          'example':''
        };
        console.log(this.notasCursosParams);
        this.getCursosList(uri , this.notasCursosParams);
    }
      ,
      error=>{console.log(error);}

    )
  }

  getCursosList(uri,params){
    this.http.get(uri,params)
  .subscribe(
    cursos =>{
      this.cursos = cursos;     
       this.idmatriculaperlet = cursos[0].id;
       let uri =`/notas/${this.idmatriculaperlet}`;
       this.getNotasConceito(uri);
       console.log(this.cursos);
    },
    error=>{console.log(error)}
  )  
}

getNotasConceito(uri):any{
  this.http.get(uri)
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
      this.notaFinalB1={prova:'Nota Bimestre', conceito: this.notasConceito.bimestre1};

    this.provasNotas2 = [
      {prova:'Quick Review', conceito: this.notasConceito.quick}, 
      {prova:'Speaking Skills', conceito: this.notasConceito.speaking2},
      {prova:'Writing Skills', conceito: this.notasConceito.writing2}, 
      {prova:'Listening Skills', conceito: this.notasConceito.listening2},
      {prova:'Reading skills', conceito: this.notasConceito.reading2}
    ]  
    this.notaFinalB2={prova:'Nota Bimestre', conceito: this.notasConceito.bimestre2}; 

    this.provasNotasFinais =[
      {prova:'Writing Final', conceito: this.notasConceito.writingfinal},
      {prova: 'Oral Final', conceito: this.notasConceito.oralfinal},  
      {prova:'Use of English', conceito: this.notasConceito.useofenglish}       

    ]
    this.notaFinal={prova:'Nota Final', conceito: this.notasConceito.notafinal}  ;
    this.loader.dismiss();
    },
    error=>{console.log(error)}
  )


}


createloader(){
    
  this.loader = this.loadingCtrl.create({
   spinner: "crescent",
   content:"Carregando..."
 });
 }



}



























