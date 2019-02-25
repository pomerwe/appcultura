import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { LoginServiceProvider } from '../login-service/login-service';
import { Functions } from '../../functions/functions';
import { AlertController } from 'ionic-angular';
/*
  Generated class for the ContasChooseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ContasChooseProvider {
  private conta;

  constructor(public http: HttpClient, private alert:AlertController,
    private functions:Functions,
    private loginService:LoginServiceProvider) {
   
  }
  check = false;
  public contasChoose(): Promise<any> { 
   
    
   return new Promise((resolve , reject) => { 
     if(this.loginService.getContas().length>1){
    let alert = this.alert.create({enableBackdropDismiss: false});
    alert.setTitle('Escolha a conta');
    
    for(let acc of this.loginService.getContas()){
      alert.addInput({
        type:'radio',
        label:this.functions.nomes(acc.nome),
        value:acc,
        checked:false,
        
      });

    }
    

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.check = true;
        data.checked = true;
        
        resolve(data);
       
        
      }
    });
    
    alert.present();
  }
  else{
    let data = this.loginService.getContas()[0];
    data.checked = true;
    resolve(data);

  }

}
);
  
}

  public setConta(conta){
    this.conta = conta;
  }

  public getConta(){
    return this.conta;
  }

  public unsetContas(){
    this.check = false;
    this.setConta(undefined);
  }
}
