import { Injectable } from '@angular/core';
import { HttpServiceProvider } from '../http-service/http-service';
import { ISubscription } from '../../../node_modules/rxjs/Subscription';
import * as __ from 'underscore';
import { LocalNotifications } from '../../../node_modules/@ionic-native/local-notifications';
import { NetworkCheckServiceProvider } from '../network-check-service/network-check-service';
import { LoginServiceProvider } from '../login-service/login-service';
import { Functions } from '../../functions/functions';
import { LoadingController } from '../../../node_modules/ionic-angular/';
import { TranslateService } from '@ngx-translate/core';
import { environment as ENV } from '../../environments/environment';
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
  chamadasPattern: {matricula:any , nome:string, chamadas: Array<Object>,base:any}[] = [];
  contas = [];
  loader ;
  first = true;
  chamadas;
  top10;
  notificationsId = 0;
  toSchedule = [];
  loaderCarregandoLabel = '';
  constructor(
    private http:HttpServiceProvider,    
    private netCheck:NetworkCheckServiceProvider,
    private loginServ:LoginServiceProvider,
    private functions:Functions,
    private loadingCtrl:LoadingController,  
    private translate:TranslateService
  ) {
    
    this.loadTranslatedVariables();
  }

  carregarVariaveis(){
    this.loginServ.getContas().forEach(
      conta=>{
        
        this.chamadasPattern.push(
          {
            matricula:conta.matricula,            
            nome:this.functions.nomes(conta.nome),
            chamadas:[],
            base:conta.base
          }
        );
        
        this.top10Pattern.push(
          {
            matricula:conta.matricula,            
            nome:this.functions.nomes(conta.nome),
            chamadas:[],
            base:conta.base
          }
        );
        
        this.contas.push(
          {
            id: conta.id,
            matricula:conta.matricula,
            nome:this.functions.nomes(conta.nome),
            base:conta.base
          }
        );
      }
    );
    this.chamadas = __.indexBy(this.chamadasPattern,'matricula');
    this.top10 = __.indexBy(this.top10Pattern,'matricula');
    this.createLoader();
    this.load();
  }
  setAutoReloadParam(conta){
    this.autoReloadParam = {
      'page':0,
      'matricula':conta.matricula,
      'size':10,
      'example':'',
      'base':conta.base
    }
  }

  
  getDiaDia(conta){
    let url = ENV.BASE_URL;
    let urn = '/classe/dia-dia';
    this.subscriptions.push(this.http.specialGet(url,urn,this.autoReloadParam).subscribe(

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
    let url = ENV.BASE_URL;
    let urn = '/classe/dia-dia';
    // this.param={
    //   'page':0,
    //   'matricula':'59245',
    //   'size':10,
    //   'example':'',
    //   'sort':'data,desc'
    // }
    this.subscriptions.push(this.http.specialGet(url,urn,this.autoReloadParam).subscribe(
    

      data =>{ 
        console.log(data);
        // let notifications = [];
        // for(let chamada of data.content){
        // if(__.indexOf(this.top10[conta.matricula].chamadas,chamada.id) == -1){
        //   this.chamadas[conta.matricula].chamadas.push(chamada);
        //   notifications.push(chamada);
        // } 
        // }
        // this.chamadas[conta.matricula].chamadas = __.sortBy(data.content,'data').reverse();
        // notifications = __.sortBy(notifications, 'data').reverse();
        // this.top10[conta.matricula].chamadas = [];
        // for(let cham of this.chamadas[conta.matricula].chamadas){          
        //   this.top10[conta.matricula].chamadas.push(cham.id);
        // }
        // for(let chamNot of notifications){
        //   this.toSchedule.push({
        //     id: this.notificationsId,
        //     title:`Cultura Inglesa MG - ${conta.nome}`  ,
        //     text: `${chamNot.periodo}\nDescription: ${chamNot.descricao}\nHomework: ${chamNot.tarefasdia}\nAttendance: ${chamNot.freq}`,
        //     vibrate:true
        //   });
        //   this.notificationsId = this.notificationsId + 1;
        // }
        
          
          
        
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
  // autoReload(){
   
  //   this.contas.forEach(
  //     conta=>{
  //       this.setAutoReloadParam(conta.matricula);
        
  //       //this.getDiaDiaAutoReload(conta);
        
        
  //     }
  //   );
  //   // this.localNotifications.schedule(this.toSchedule);
  //   // this.toSchedule = [];
     
    
    
  // }

  load(){
    
    this.loader.present();
    this.contas.forEach(
        conta=>{
          this.setAutoReloadParam(conta);         
          this.getDiaDia(conta);
          
        }
      );
    
  }

  getDiaDiaByMatricula(matricula){
    return this.chamadas[matricula].chamadas;
  }

  createLoader(){
    this.loadTranslatedVariables();
    this.loader=this.loadingCtrl.create({
        spinner: "crescent",
        content:this.loaderCarregandoLabel

      });
}

  
loadTranslatedVariables(){
  this.translate.get(['loader_carregando'])
        .subscribe(
          data => {
            this.loaderCarregandoLabel = data.loader_carregando;
        
           
          }
        );
    }
}
