import { Injectable } from '@angular/core';
import { HttpServiceProvider } from '../http-service/http-service';
import { timer as t } from '../../../node_modules/rxjs/Observable/timer';
import { ISubscription } from '../../../node_modules/rxjs/Subscription';
import * as __ from 'underscore';
import { LocalNotifications } from '../../../node_modules/@ionic-native/local-notifications';
import { NetworkCheckServiceProvider } from '../network-check-service/network-check-service';
import { LoginServiceProvider } from '../login-service/login-service';
import { Functions } from '../../functions/functions';
import { LoadingController } from '../../../node_modules/ionic-angular/';
import { HttpParams } from '../../../node_modules/@angular/common/http';
/*
  Generated class for the AutoReloadDiaDiaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AutoReloadDiaDiaProvider {
  subscriptions:Array<ISubscription> = [];  
  autoReloadParam;
  param;
  top10Pattern = [];
  chamadasPattern: {matricula:any , nome:string, chamadas: Array<Object>}[] = [];
  contas = [];
  loader ;
  first = true;
  chamadas;
  top10;
  notificationsId = 0;
  toSchedule = [];
 
  constructor(
    private http:HttpServiceProvider,    
    private localNotifications:LocalNotifications,
    private netCheck:NetworkCheckServiceProvider,
    private loginServ:LoginServiceProvider,
    private functions:Functions,
    private loadingCtrl:LoadingController,  
  ) {
    
  }

  carregarVariaveis(){
    this.loginServ.getContas().forEach(
      conta=>{
        
        this.chamadasPattern.push(
          {
            matricula:conta.matricula,            
            nome:this.functions.nomes(conta.nome),
            chamadas:[]
          }
        );
        
        this.top10Pattern.push(
          {
            matricula:conta.matricula,            
            nome:this.functions.nomes(conta.nome),
            chamadas:[]
          }
        );
        
        this.contas.push(
          {
            id: conta.id,
            matricula:conta.matricula,
            nome:this.functions.nomes(conta.nome)
          }
        );
      }
    );
    this.chamadas = __.indexBy(this.chamadasPattern,'matricula');
    this.top10 = __.indexBy(this.top10Pattern,'matricula');
    this.createLoader();
    this.load();
  }
  setAutoReloadParam(matricula){
    this.autoReloadParam = {
      'page':0,
      'matricula':matricula,
      'size':10,
      'example':'',
      'sort':'data,desc'
    }
  }

  
  getDiaDia(conta){
    let uri = '/dia-dia';
    this.subscriptions.push(this.http.get(uri,this.autoReloadParam).subscribe(

      data =>{ 
        
        this.chamadas[conta.matricula].chamadas = __.sortBy(data.content,'data').reverse();
        data.content.forEach(chamada => {
          this.top10[conta.matricula].chamadas.push(chamada.id)
        });
        
        this.loader.dismiss();
        this.createLoader();     
            
      },
      error =>{
        this.loader.dismiss();
        this.createLoader();
        if(!this.netCheck.check()){
        setTimeout(()=>{ 
          this.subscriptions.forEach(subs=>{subs.unsubscribe()});
          
        },300);
        }
      
      }

    ));
  }

  getDiaDiaAutoReload(conta){
    let uri = '/dia-dia';
    // this.param={
    //   'page':0,
    //   'matricula':'59245',
    //   'size':10,
    //   'example':'',
    //   'sort':'data,desc'
    // }
    this.subscriptions.push(this.http.get(uri,this.autoReloadParam).subscribe(

      data =>{ 
                
        let notifications = [];
        for(let chamada of data.content){
        if(__.indexOf(this.top10[conta.matricula].chamadas,chamada.id) == -1){
          this.chamadas[conta.matricula].chamadas.push(chamada);
          notifications.push(chamada);
        } 
        }
        this.chamadas[conta.matricula].chamadas = __.sortBy(data.content,'data').reverse();
        notifications = __.sortBy(notifications, 'data').reverse();
        this.top10[conta.matricula].chamadas = [];
        for(let cham of this.chamadas[conta.matricula].chamadas){          
          this.top10[conta.matricula].chamadas.push(cham.id);
        }
        for(let chamNot of notifications){
          this.toSchedule.push({
            id: this.notificationsId,
            title:`Cultura Inglesa MG - ${conta.nome}`  ,
            text: `${chamNot.periodo}\nDescription: ${chamNot.descricao}\nHomework: ${chamNot.tarefasdia}\nAttendance: ${chamNot.freq}`,
            vibrate:true
          });
          this.notificationsId = this.notificationsId + 1;
        }
        
          
          
        
      },
      error =>{
        this.loader.dismiss();
        this.createLoader();
        if(!this.netCheck.check()){
        setTimeout(()=>{ 
          this.subscriptions.forEach(subs=>{subs.unsubscribe()});
          
        },300);
        }
      
      }

    ));
  }
  autoReload(){
   
    this.contas.forEach(
      conta=>{
        this.setAutoReloadParam(conta.matricula);
        
        this.getDiaDiaAutoReload(conta);
        
        
      }
    );
    this.localNotifications.schedule(this.toSchedule);
    this.toSchedule = [];
     
    
    
  }

  load(){
    
    this.loader.present();
    this.contas.forEach(
        conta=>{
          this.setAutoReloadParam(conta.matricula);         
          this.getDiaDia(conta);
          
        }
      );
    
  }

  getDiaDiaByMatricula(matricula){
    return this.chamadas[matricula].chamadas;
  }

  createLoader(){
    this.loader=this.loadingCtrl.create({
        spinner: "crescent",
        content:"Carregando..."
      });
}

  
}
