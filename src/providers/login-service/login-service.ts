
import { Injectable } from '@angular/core';
import { AlunoProvider } from '../aluno/aluno';

/*
  Generated class for the LoginServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginServiceProvider {


  private userInfo;
  private contas = [];

  public getUserData():Promise<any>{
   return new Promise( 
     (resolve,reject)=>
     {
       resolve(this.userInfo);
    }); 
  }

  public setUserData(userData){
    this.userInfo = userData; 
   }

   public getContas(){
     return this.contas;
   }
   public setContas(contas){
     this.contas.push(contas);
   }
   public pushToContas(contas){
     this.contas.push(contas);
   }

   public logoff(){
     while(this.contas.length){
      this.contas.pop();
     }
     
     
   }
}
