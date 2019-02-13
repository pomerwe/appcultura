import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Functions }  from '../../functions/functions';
import { Observable } from '../../../node_modules/rxjs/Observable';
/*
  Generated class for the AlunoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlunoProvider {

  private matricula;
  private email;
  private nome;
  private checked;

  constructor(
    public http: HttpClient,
    private functions:Functions
    ) {

  }

  public setMatricula(matricula){
    this.matricula=matricula;
  }
  public getMatricula(){
    return this.matricula;
  }
  public setEmail(email){
    this.email=email;
  }
  public getEmail(){
    return this.email;
  }
  public setNome(nome){
    this.nome=nome;
  }
  public getNome(){
    return this.nome;
  }
  public setChecked(checked){
    this.checked=checked;
  }
  public getChecked(){
    return this.checked;
  }

  public setAluno(data){
    this.matricula = data.id;
    this.email = data.email;
    this.nome = this.functions.nomes(data.nome);
    let checked = data.checked;
    if(checked == undefined){
      this.checked = false ;
    }else{
      this.checked = data.checked;
    }
   
  }

  public getAluno():Promise<any>{
    return new Promise ((resolve , reject) =>{
      let object={
        matricula:this.getMatricula(),
        email:this.getEmail(),
        nome:this.getNome()
      }
      resolve(object);

    })
  }

  public getAluno2 ():Observable<any>{
    return new Observable(obs =>{
      let object={
        matricula:this.getMatricula(),
        email:this.getEmail(),
        nome:this.getNome()
      }
      obs.next(object);
      obs.complete;
    }
  )
  }

  public unsetAluno(){
    this.setMatricula(undefined);
    this.setChecked(undefined);
    this.setEmail(undefined);
    this.setNome(undefined);
  }
}
