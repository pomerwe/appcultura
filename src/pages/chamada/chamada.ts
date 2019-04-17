import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { TransitionsProvider } from '../../providers/transitions/transitions';
import { ISubscription } from 'rxjs/Subscription';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import {environment as env} from '../../environments/environment'
/**
 * Generated class for the ChamadaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chamada',
  templateUrl: 'chamada.html',
})
export class ChamadaPage {
  @ViewChild(Navbar) navBar:Navbar; 
  chamada;
  chamadaParams;
  subscriptions:Array<ISubscription> = [];


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private transitions:TransitionsProvider,
    private http:HttpServiceProvider
    ) {
      let params = navParams.get('chamada');
      this.chamadaParams = {
        "codigoAula":params.codigoAula,
        "base":params.base
      }
  }

  ionViewWillEnter(){
    
    let pushParam = this.navParams.get('push');
    if(pushParam!=undefined){
      if(pushParam==true) {
        this.transitions.push();
        this.navParams.data = {push:false};
      }  
    } 
  }
  
  ionViewDidLoad() {
    
    //Cancela a animação feita pelo Ionic
    this.navBar.backButtonClick = (e:UIEvent) => {
      this.navCtrl.pop({animate:false});
    };
    this.getChamada();
  }

  ionViewWillLeave(){
    let pushParam = this.navParams.get('push');
    if(pushParam==undefined) this.transitions.back();
    else if(pushParam!=true) this.transitions.back();
    this.subscriptions.forEach(
      subs=>{subs.unsubscribe();}
    );
  }


  getChamada(){

    let url = env.BASE_URL;
    let urn = '/classe/chamada';
    let params = this.chamadaParams;

    this.http.specialGet(url,urn,params)
      .subscribe(
        chamada=>{
          this.chamada = chamada;
          console.log(chamada);
        },
        error=>{
          console.log(error);
        }
      )
  }

}
