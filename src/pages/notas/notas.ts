import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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
  notasConceitoParams;
  matricula;
  codperlet;
  codperlets = [];
  bimestre=0;
  bimestres=[
    {bimestre:'1º', value:0},
    {bimestre:'2º', value:1},
    {bimestre:'Notas Finais',value:2}
  ]

  notasConceitoList;
  notasConceito;

  //curso
  notasConceitoId;

  provasNotas1;
  notaFinalB1;
  provasNotas2;
  notaFinalB2;
  provasNotasFinais;
  notaFinal;

  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams , 
    private http:HttpServiceProvider , 
    private functions:Functions,
    private alunos:AlunoProvider) {
  }

  ionViewDidLoad() {
    this.alunos.getAluno2()
    .subscribe(
      data=>{
        console.log(data);
        this.matricula=data.matricula;
      }
    )
    this.carregarDados();
  }

  carregarDados(){
    //47874 , 59245 ,114023
    this.getCodperlet(this.matricula);
   

  }

  getCodperlet(matricula){
    this.http.getCodperlet(matricula)
    .subscribe(
      codperlet =>{
        
        this.codperlets = codperlet;
        
        if(this.codperlet == undefined){
          this.codperlet = this.codperlets[0].codperlet;

        }
        this.notasConceitoParams = {matricula:this.matricula,codperlet:this.codperlet};
        
      this.getNotasConceitoList(this.notasConceitoParams);}
      ,
      error=>{console.log(error);}

    )
  }

  getNotasConceitoList(params){
    this.http.getNotasConceitoList(params)
  .subscribe(
    notasConceitoList =>{
      this.notasConceitoList = notasConceitoList;     
       this.notasConceitoId = notasConceitoList[0].id;
       this.getNotasConceito(this.notasConceitoId);
       console.log(this.notasConceitoList);
    },
    error=>{console.log(error)}
  )  
}

getNotasConceito(id):any{
  this.http.getNotasConceito(id)
  .subscribe(
    notasConceito=>{
      this.notasConceito = notasConceito;
      this.provasNotas1 = [
      {prova:'Revision Test', conceito: this.notasConceito.revision},
      {prova:'Speaking skills', conceito: this.notasConceito.speaking1},
      {prova:'Writing skills', conceito: this.notasConceito.writing1}, 
      {prova:'Listening skills', conceito: this.notasConceito.listening1},
      {prova:'Reading skills', conceito: this.notasConceito.reading1}
  ]   
      this.notaFinalB1={prova:'Nota Bimestre', conceito: this.notasConceito.bimestre1};

    this.provasNotas2 = [
      {prova:'Quick Review', conceito: this.notasConceito.quick}, 
      {prova:'Speaking skills', conceito: this.notasConceito.speaking2},
      {prova:'Writing skills', conceito: this.notasConceito.writing2}, 
      {prova:'Listening skills', conceito: this.notasConceito.listening2},
      {prova:'Reading skills', conceito: this.notasConceito.reading2}
    ]  
    this.notaFinalB2={prova:'Nota Bimestre', conceito: this.notasConceito.bimestre2}; 

    this.provasNotasFinais =[
      {prova:'Writing Final', conceito: this.notasConceito.writingfinal},
      {prova: 'Oral Final', conceito: this.notasConceito.oralfinal},  
      {prova:'Use of English', conceito: this.notasConceito.useofenglish}       

    ]
    this.notaFinal={prova:'Nota Final', conceito: this.notasConceito.notafinal}  ;
    
    },
    error=>{console.log(error)}
  )


}






}



























