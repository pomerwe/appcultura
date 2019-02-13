import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, InfiniteScroll, LoadingController } from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { ContasChooseProvider } from '../../providers/contas-choose/contas-choose';
import 'rxjs/add/operator/toPromise';
import { Observable } from '../../../node_modules/rxjs/Observable';
import { AlunoProvider } from '../../providers/aluno/aluno';
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the FeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

 // chamada:[{title: string ,
  // professor: string,
  // data: string ,
  // homework: string,
  // attendance: string,
  // curso: string,
  // codtur: string}]
  chamada;
  refresher;
  page = 0;
  infiniteScroll:any ;
  user;
  resp;
  diaDiaParam;
  matricula;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private http:HttpServiceProvider,
    private loginService:LoginServiceProvider,
    private contasChoose:ContasChooseProvider,
    private aluno:AlunoProvider,
    private menu:MyApp,
    public loadingCtrl: LoadingController
    
    ) {
   
  
  }

      loader = this.loadingCtrl.create({
      spinner: "crescent",
      content:"Carregando..."
    });


    
    
  

   ionViewDidLoad() {
    
    if(this.contasChoose.check==false){
      this.contasChoose
      .contasChoose()
      .then(
        data=>{
          
          this.aluno.setAluno(data);
          this.aluno.getAluno()
          .then(
            data=>{
              this.menu.nome = data.nome;
              this.menu.matricula = data.matricula;
              this.menu.email = data.email; 
              this.loader.present();
              this.diaDiaRoutine(data);
              
            },
            error=>{
              console.log(error);
            }
          );
        }
      );
    }
    else{
      this.setMatricula(this.aluno.getMatricula());
      this.loader.present();
      this.getDiaDia();
    }
  }
 
 
  setDiaDiaParam(){
    this.diaDiaParam = {
      page:this.getPage(),
      matricula:this.getMatricula()
    }
  }

  getDiaDia(){
    this.setDiaDiaParam();
    this.http.getDiaDia(this.diaDiaParam).subscribe(

      data =>{ 
        this.chamada = data.content;
        this.loader.dismiss();
        if(this.refresher!=undefined){
          this.refresher.complete();
        }
      },
      error =>{

      }

    )

  }


  setPage(page){
    this.page = page;

  }
  getPage():number{
    return this.page;
  }
  setMatricula(matricula){
    this.matricula = matricula;

  }
  getMatricula():number{
    return this.matricula;
  }

 

    
  diaDiaRoutine(data){
    this.setPage(0);
    this.setMatricula(data.matricula);
    this.getDiaDia();

  }



  doRefresh(refresher) {
   this.refresher = refresher;
    
    while(this.chamada.length){
      this.chamada.pop();
    }
    this.setPage(0);
    
      this.aluno.getAluno()
      .then(
        data=>{
          this.setMatricula(data.matricula);
          this.getDiaDia();
        },
        error =>{
          console.log(error);
        }
    );
    if(this.infiniteScroll!=undefined){
      this.infiniteScroll.enable(true);
    }
    
    

   
  }


   doInfinite(infiniteScroll: InfiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    if(this.getPage()==0){
      this.setPage(1);
    }    
    this.setDiaDiaParam();
    this.http.getDiaDia(this.diaDiaParam).subscribe(
      data => {
      for (var i = 0; i < data.content.length; i++) {
        this.chamada.push( data.content[i] );
      }
      let last:boolean = data.last;
     this.setPage(data.number+1);
      infiniteScroll.complete();

      if (last == true) {
        infiniteScroll.enable(false);
      }
    });
  }


}
