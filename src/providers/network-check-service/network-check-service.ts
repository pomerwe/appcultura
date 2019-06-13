import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network } from '../../../node_modules/@ionic-native/network';
import { AlertController } from '../../../node_modules/ionic-angular/components/alert/alert-controller';
import { TranslateService } from '@ngx-translate/core';

/*
  Generated class for the NetworkCheckServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NetworkCheckServiceProvider {

  notConnectedAlertTitle = '';
  notConnectedAlertMessage = '';

  constructor(public http: HttpClient , 
    private network: Network, 
    private alert:AlertController,
    private translate:TranslateService) {

    this.loadTranslatedVariables();
  }
  check():boolean{
    let conntype = this.network.type;
    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }

  
  
  notConnected(){
    this.loadTranslatedVariables();
    let alert = this.alert.create({
      title:this.notConnectedAlertTitle,
      message: this.notConnectedAlertMessage,
      buttons:[
        {text:'OK',role:'cancel'}
      ]

    })
    alert.present();
  }

  loadTranslatedVariables(){
    
    this.translate.get(['netcheck_notconnectedtitle','netcheck_notconnectedmessage'])
          .subscribe(
            data => {
              this.notConnectedAlertTitle = data.netcheck_notconnectedtitle;
              this.notConnectedAlertMessage = data.netcheck_notconnectedmessage;
             
            }
          );
      }
}
