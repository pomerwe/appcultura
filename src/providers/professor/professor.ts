import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs';
import { DateTime } from '../../../node_modules/ionic-angular/umd';
import * as __ from 'underscore';
import { PromiseObservable } from '../../../node_modules/rxjs/observable/PromiseObservable';
/*
  Generated class for the ProfessorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export class Turma{
  base: String;
  codigoPeriodo: String;
  codigoProfessor: String;
  curso: String;
  dataHoraInicio: DateTime;
  dia: String;
  filial: any;
  siglaFilial: String;
  turma: String;
  horario: String;
  id: String;
  idPeriodo: number;
  idProfessor: number;
  visivel: boolean;
}


@Injectable()
export class ProfessorProvider {
  loaded=false;
  nome;
  photo;
  usuario;
  turmas:Array<Turma> = [];
  filiais = [];
  turmasByFilial;
  constructor() {
  }


 setPhoto(photo){
   this.photo = photo;
 }

 getPhoto(){
   return this.photo;
 }

 setNome(nome){
   this.nome=nome;
 }

 getNome(){
   return this.nome;
 }

 setUsuario(usuario){
   this.usuario=usuario;
 }

 getUsuario(){
   return this.usuario;
 }

 setProfessor(data){
   this.nome=data.name;
   this.photo=data.photo;
   this.usuario=data.username;
 }

 getProfessor():Observable<any>{
   return new Observable(
     obs=>{
       let obj={
         nome:this.getNome(),
         photo:this.getPhoto(),
         usuario:this.getUsuario(),
         turmas:this.getTurmas()
       }
       obs.next(obj);
       obs.complete();
     }
   )
 }

 unsetProfessor(){
  this.nome = undefined;
  this.photo = undefined;
  this.usuario = undefined;
  this.turmas = [];
  this.loaded = false;
  this.filiais = [];
  this.turmasByFilial = [];
 }

 onTurmasRefresh(){
  this.turmas= [];
  this.filiais = [];
  this.turmasByFilial = [];
 }

//  pushToTurmas(turmas):Promise<any>{
   
//    return new Promise((resolve,reject)=>{
//       turmas.forEach(turma=>this.turmas.push(turma));
//       resolve(this.turmas);
//    });
      
//   } 
  pushToTurmas(turmas):Promise<any>{

    //Promise que retorna um Array especifico 
    //que divide todas as turmas que o professor atua em filiais.
    return new Promise((resolve)=>{
      //Para cada turma, adiciona uma filial no array Filiais.
      turmas.forEach(turma=>this.turmas.push(turma));
      this.turmas.forEach(
        turma=>{
          this.filiais.push({filial:turma.filial,turmas:[]});
      });
      //Função underscore que unifica valores duplicados
      this.filiais = __.uniq(this.filiais,'filial');

      //Função underscore que transforma o index "[index]" do array no nome da filial
      this.turmasByFilial = __.indexBy(this.filiais,'filial');

      //Para cada turma do array turmas adiciona a turma
      // no array turmasByFilial[filial].turmas 
      this.turmas.forEach(
        turma=>{
          this.turmasByFilial[turma.filial].turmas.push(turma);
        }
      );
      resolve(this.turmasByFilial);
    });
    
  }
          
          
   

  getTurmas(){
    return this.turmas;
  }

  getTurmasByFilial(){
    return this.turmasByFilial;
  }

  getFiliais(){
    return this.filiais;
  }

}
