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

  //Armazenará a matrícula do aluno selecionado para o acesso das demais classes
  private matricula;

  //Armazenará o usuario do aluno selecionado para o acesso das demais classes
  private usuario;

  //Armazenará o nome do aluno selecionado para o acesso das demais classes
  private nome;

  //Variável utilizada no menu para a div Popover.
  private checked;

  //Armazenará a lista de codperlets do aluno selecionado para o acesso das demais classes
  private codperlets = [];

  //Armazenará a URI da foto do aluno selecionado para o acesso das demais classes
  private photo;

  //Armazenará a base de dados referente ao aluno selecionado para o acesso das demais classes
  private base;

  constructor(
    private functions:Functions
    ) {

  }

  public setBase(base){
    this.base = base;
  }
  public getBase(){
    return this.base;
  }

  public setMatricula(matricula){
    this.matricula=matricula;
  }
  public getMatricula(){
    return this.matricula;
  }
  public setUsuario(usuario){
    this.usuario=usuario;
  }
  public getUsuario(){
    return this.usuario;
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
  public setCodperlets(codperlets){
    this.codperlets = codperlets;
  }
  public getCodperlets(){
    return this.codperlets;
  }

  public setAluno(data){
    this.photo = data.foto;
    this.matricula = data.matricula;
    this.usuario = data.email;
    this.nome = this.functions.nomes(data.nome);
    this.base = data.base;
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
        usuario:this.getUsuario(),
        nome:this.getNome(),
        photo:this.getPhoto(),
        base:this.getBase()
      }
      resolve(object);

    })
  }

  public getAluno2 ():Observable<any>{
    return new Observable(obs =>{
      let object={
        matricula:this.getMatricula(),
        usuario:this.getUsuario(),
        nome:this.getNome(),
        photo:this.getPhoto(),
        base:this.getBase()
      }
      obs.next(object);
      obs.complete;
    }
  )
  }

  public getPhoto(){
    return this.photo;
  }

  public setPhoto(photo){
    this.photo = photo;
  }

  //Função que unset todas as variáveis 
  public unsetAluno(){
    this.setMatricula(undefined);
    this.setChecked(undefined);
    this.setUsuario(undefined);
    this.setNome(undefined);
    this.setCodperlets(undefined);
    this.setPhoto(undefined);
    this.setBase(undefined);
  
  }
}
