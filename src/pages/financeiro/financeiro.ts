import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, MenuController, Navbar } from 'ionic-angular';
import { Clipboard } from '../../../node_modules/@ionic-native/clipboard';
import { AlunoProvider } from '../../providers/aluno/aluno';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { Functions } from '../../functions/functions';
import { File, IWriteOptions } from '../../../node_modules/@ionic-native/file';
import { saveAs } from 'file-saver';
import { DeviceServiceProvider } from '../../providers/device-service/device-service';
import { FileOpener } from '../../../node_modules/@ionic-native/file-opener';
import { ISubscription } from '../../../node_modules/rxjs/Subscription';
import { NetworkCheckServiceProvider } from '../../providers/network-check-service/network-check-service';
import * as __ from 'underscore';
import { TransitionsProvider } from '../../providers/transitions/transitions';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the FinanceiroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
//define this
@IonicPage()
@Component({
  selector: 'page-financeiro',
  templateUrl: 'financeiro.html',
})
export class FinanceiroPage {

  @ViewChild(Navbar) navBar:Navbar; 

  //Define o parâmetro de página do pageable, que será enviado na requisição;
  page=0;

  //Representa o nome do Aluno nessa page
  nome: string;

  //Representa qual base de dados será acessada na requisição
  base: string;

  //Representa a matrícula do Aluno nessa page
  matricula: string;

  //Array de cursos que o aluno está cursando, que será carregado da requisição
  cursos = [];

  //Array de titulo. Contém os títulos das duas Divs principais dessa page;
  title=[];

  //Controla a estilização do icon de seta para trás
  arrowBackDisplay = "none";
  
  //Controla a estilização do icon de seta para frente
  arrowForwardDisplay = "initial";

  //Array de boletos que serão carregados da requisição
  boletos=[];

  //Array de boletos abertos que vieram da requisição
  boletosAbertos=[];

  //Será Set com um Loader
  loader;

  //Controla a Div NoBoletoMessage. Ao não haver boletos abertos, aparecerá a Div da mensagem.
  noBoletoAberto = false;

  //Array de subscrições de todos os Observables aqui presentes 
  subscriptions:Array<ISubscription> = [];

  //Controla a exibição da Div NoConnectionMessage
  noConnectionTop = false;

  //Será set com um refresher
  refresher;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private clipboard:Clipboard,
    private alunoServ:AlunoProvider,
    private http:HttpServiceProvider,
    private loadingCtrl:LoadingController,
    private functions:Functions,
    private file:File,
    private deviceServ:DeviceServiceProvider,
    private fileOpener:FileOpener,
    private netCheck:NetworkCheckServiceProvider,
    private menu:MenuController,
    private transitions:TransitionsProvider,
    private translate: TranslateService

  ) {
    this.translate.get('financeiro_historico')
    .subscribe(
      data=>this.title.push(data)
    );
    this.translate.get('financeiro_boletos')
    .subscribe(
      data=>this.title.push(data)
    );
  }

  ionViewDidLoad() {
    
    //Cancela a animação feita pelo Ionic
    this.navBar.backButtonClick = (e:UIEvent) => {
      this.navCtrl.pop({animate:false});
    };
    //Função que proibe a exibição do menu através do arrastar o dedo pela tela.
    this.menu.swipeEnable(false);

    //Ativação do scroll na entrada da view
    setTimeout(()=>{this.scrollDownHistoricoDiv()},300);
  }
  ionViewWillEnter(){
    let pushParam = this.navParams.get('push');
    if(pushParam!=undefined){
      if(pushParam==true) {
        this.transitions.push();
        this.navParams.data = {push:false};
      }  
    }  
    this.createloader();
    this.loader.present();

    //A seguir uma sequência de valores set, através do provider Aluno
    this.setNome(this.alunoServ.getNome());
    this.setBase(this.alunoServ.getBase());
    this.setMatricula(this.alunoServ.getMatricula());

    //Caso a variável boletos não tenha valores vinculados, faz a requisição à API
    if(this.boletos.length == 0){
      this.getBoletosDb();
    }
    //Caso haja valores vinculados, mas não sejam corretamente 
    //vinculados ao aluno selecionado, faz a requisição à API
    else if(this.boletos[0].matricula.match(this.alunoServ.getMatricula())===null){
      this.getBoletosDb();
    }
  }
  ionViewWillLeave(){
    this.transitions.back();

    //Permite que o usuário abra o menu arrastando o dedo novamente
    this.menu.swipeEnable(true);

    //Limpa todas as subscrições dos Observables
    this.subscriptions.forEach(
      subs=>{subs.unsubscribe();}
    );
  }

  //Função que instancia um Loader através do LoadingController
  createloader(){
    
    this.loader = this.loadingCtrl.create({
     spinner: "crescent",
     content:"Carregando..."
   });
   }

   //Função que utiliza do Ionic Native para copiar o código de 
   //barras do boleto para o copy and paste do android/ios
  copiarCodigo(codigo){
    this.clipboard.copy(codigo);
  }

  //Função que faz a transição de Classes das Divs Histórico e Boleto, bagulho muito louco haha. 
  forward(historico,boletos){
    this.page = 1;
      boletos.classList.remove('hidden');
      historico.classList.remove('swipeBack');
      boletos.classList.remove('swipe');
      historico.classList.add('swipe');
      boletos.classList.add('swipeBack');
      setTimeout(()=>{historico.classList.add('hidden')},230);
  }
  //Função que faz a transição de Classes das Divs Histórico e Boleto, bagulho muito louco haha. 
  back(historico,boletos){
      this.page = 0;
      historico.classList.remove('hidden');
      boletos.classList.remove('swipeBack');
      historico.classList.remove('swipe');
      boletos.classList.add('swipe');
      historico.classList.add('swipeBack');
      setTimeout(()=>{boletos.classList.add('hidden')},230);
  }

  // Função que, quando uma Div está aberta, some a seta que não é correspondente
  setUnsetArrows(){
    if(this.page==0){
      
      this.arrowBackDisplay = "none";
      this.arrowForwardDisplay = "initial";
    }
    if(this.page==1){
      
      this.arrowBackDisplay = "initial";
      this.arrowForwardDisplay = "none";
    }
  }

  //Requisição http para buscar os boletos
  getBoletosDb(){
    let uri = '/financeiro';
    let params = 
    {
      'matricula':this.getMatricula(), 
      'example':'',
      'base':this.getBase(),
      'sort':'data,asc'
    };
    this.subscriptions.push(this.http.get(uri,params)
    .subscribe(
      data=>{
        
        this.noConnectionTop = false;
      
        //Função da bilbioteca Underscore(Foda pra crl) que 
        //não permite duplicações do parâmetro escolhido, no caso, "Id"
        this.boletos = __.uniq(data,'id');

        //Função que ordena os boletos pela data de vencimento
        this.boletos = __.sortBy(this.boletos,'vencimento');
        
        //Carrega a lista de cursos, para a variável cursos, que vêm junto dos boletos;
        this.boletos.forEach(bol=>{this.cursos.push(bol.periodo)});
        this.cursos = __.uniq(this.cursos);
        
        //Itera a variável boletos para encontrar aqueles que 
        //estão abertos e enviar para a variável boletosAbertos
        this.getBoletos().forEach(bol=>{
          if(bol.estado.match('PAGO')===null){
              
            this.boletosAbertos.push(bol);
        }

        });
          
        //Caso não haja boleto aberto, mostra a Div de NoBoletoMessage
        this.boletosAbertos.length == 0 ? this.noBoletoAberto = true : this.noBoletoAberto = false;
        if(this.refresher != undefined){
          this.refresher.complete();
        }
        if(this.loader != undefined){
          this.loader.dismiss();
        }
      },
      error=>{
        if(this.loader != undefined ){
          setTimeout(
            ()=>{
              this.loader.dismiss();
            },300);
          
        }
        if(this.refresher != undefined){
          setTimeout(
            ()=>{
              this.refresher.complete();
            },300);
          
        }
        if(!this.netCheck.check()){
          setTimeout(
            ()=>{
              this.noConnectionTop = true;
            },300);
          
        }
        console.log(error);
      }
    ));
  }

  //Função que faz uma requisição HTTP para o Download dos Boletos
  baixarBoleto(id,base,matricula){
    let uri= '/financeiro/imprimir';
    let params = {'id':id,
                  'base':base,
                  'matricula':matricula};

    // Define em qual lugar do smartphone o boleto será salvo 
    let storageLocation;
    this.createloader();
    this.loader.present();
    switch (this.deviceServ.getPlatform()) {

      case "Android":
          storageLocation = 'file:///storage/emulated/0/download';
          break;
      case "iOS":
          storageLocation = this.file.documentsDirectory;
          break;
  
  }
    this.subscriptions.push(
      this.http.getBlob(uri,params)
          .subscribe(
           data=>{
            
            
             const blob = new Blob([data], { type: 'application/pdf' });
             let writeOptions:IWriteOptions = {
               replace:true
             }
             saveAs(data, `relatorio.pdf`);

             //Função do Ionic Native File que escreve o arquivo no smartphone.
             this.file.writeFile(storageLocation,`${this.nome}.pdf`,blob,writeOptions)
             .then(
               data=>{
                 let filePath = data.nativeURL;

                 //Função do Ionic Native File Opener, que abre o arquivo
                 this.fileOpener.open(filePath, 'application/pdf')
                        .then(() => console.log('File is opened'))
                        .catch(e => console.log('Error opening file', e));
               
                });
             this.loader.dismiss();

          },
          error=>{
            this.loader.dismiss();
            console.log(error);
          }
          ));

  }

  //Função que faz o Refresh da páguina com o Ionic Refresher
  doRefresh(refresher) {
    this.refresher = refresher;
     
     //A seguir há uma sequência de limpa nas variáveis
     while(this.boletos.length){
       this.boletos.pop();
     }
     while(this.boletosAbertos.length){
       this.boletosAbertos.pop();
     }
     this.getBoletosDb();
 
     //Checa se há conexão com a internet
     if(!this.netCheck.check()){
       setTimeout(()=>{
         this.noConnectionTop = true;
         refresher.complete();
       },300);
       
     }
     else{
       this.noConnectionTop = false;
       
 
     
   }
  }

  // Função que unset as variáveis de boletos
  unsetBoletos(){
    this.boletos = undefined;
    this.boletosAbertos = undefined; 
  }


  getNome(){
    return this.nome;
  }
  setNome(nome){
    this.nome=nome;
  }

  getBase(){
    return this.base;
  }
  setBase(base){
    this.base=base;
  }
  setMatricula(matricula){
    this.matricula=matricula;
  }

  getMatricula(){
    return this.matricula;
  }

  getBoletos(){
    return this.boletos;
  }



  // Função que trata o evento de swipe, fazendo uma animação 
  // muito sinistra com Css, personalizada e criada manualmente.
  swipe(event,historico,boletos){
    
    
    if(event.deltaX < 0){
      this.page = 1;
      boletos.classList.remove('hidden');
      historico.classList.remove('swipeBack');
      boletos.classList.remove('swipe');
      historico.classList.add('swipe');
      boletos.classList.add('swipeBack');
      setTimeout(()=>{historico.classList.add('hidden')},230);
    }
    if(event.deltaX > 0){
      this.page = 0;
      historico.classList.remove('hidden');
      boletos.classList.remove('swipeBack');
      historico.classList.remove('swipe');
      boletos.classList.add('swipe');
      historico.classList.add('swipeBack');
      setTimeout(()=>{boletos.classList.add('hidden')},230);
      
    }
    this.setUnsetArrows();
  }

  //Função que vai dar um scroll bottom na div de historico
  scrollDownHistoricoDiv(height?){
    let scrollHeight = height != undefined ? height : 0;
    let maxScroll = document.getElementById('ioncontentdosboletos').getElementsByClassName('scroll-content')[0].scrollHeight; 
    document.getElementById('ioncontentdosboletos').getElementsByClassName('scroll-content')[0].scrollTop = scrollHeight;
    scrollHeight = scrollHeight + 30;
    setTimeout(()=>{
      if(scrollHeight < maxScroll) this.scrollDownHistoricoDiv(scrollHeight);
    },15);

  }
  
}
