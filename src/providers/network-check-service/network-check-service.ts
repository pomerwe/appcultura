import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network } from '../../../node_modules/@ionic-native/network';
import { AlertController } from '../../../node_modules/ionic-angular/components/alert/alert-controller';

/*
  Generated class for the NetworkCheckServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NetworkCheckServiceProvider {

  constructor(public http: HttpClient , private network: Network, private alert:AlertController) {
    
  }
  check():boolean{
    let conntype = this.network.type;
    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }

  
  
  notConnected(){
    let alert = this.alert.create({
      title:'Erro de Autenticação',
      message: 'Verifique sua conexão com a internet',
      buttons:[
        {text:'OK',role:'cancel'}
      ]

    })
    alert.present();
  }
}
