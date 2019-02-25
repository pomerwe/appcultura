import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, InfiniteScroll, LoadingController } from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { ContasChooseProvider } from '../../providers/contas-choose/contas-choose';
import 'rxjs/add/operator/toPromise';
import { Observable } from '../../../node_modules/rxjs/Observable';
import { AlunoProvider } from '../../providers/aluno/aluno';
import { MyApp } from '../../app/app.component';
import { UtilServiceProvider } from '../../providers/util-service/util-service';

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
    public loadingCtrl: LoadingController,
    private util:UtilServiceProvider
    
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
              this.http.getCodperlet(data.matricula)
              .subscribe(
                  codperlets =>{this.aluno.setCodperlets(codperlets);
                    console.log(this.aluno.getCodperlets());},
                  error=>{console.log(error);}
              )
              this.menu.photoUrl = this.util.getFoto(data.foto);
              console.log(this.menu.photoUrl);
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
      'page':this.getPage(),
      'matricula':this.aluno.getMatricula(),
      'size':10,
      'example':'',
      'sort':'data,desc'
    }
  }
  
  

  getDiaDia(){
    this.setDiaDiaParam();
    let uri = '/dia-dia';
    this.http.get(uri,this.diaDiaParam).subscribe(

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
    let uri = '/dia-dia';
    
    this.http.get(uri,this.diaDiaParam).subscribe(
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
