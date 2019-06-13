import { Component, Input, Output, EventEmitter } from '@angular/core';
import {environment as ENV} from '../../environments/environment';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import * as __ from 'underscore';
import { Functions } from '../../functions/functions';
import * as moment from 'moment';
import { FileChooser } from '@ionic-native/file-chooser';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { normalizeURL as norm, LoadingController, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { File as fileNative } from '@ionic-native/file';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the CommunicationComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'communication',
  templateUrl: 'communication.html'
})
export class CommunicationComponent {
  //distribuicao objeto
  @Input() objeto: string;
  //distribuicao identificador
  @Input() identificador: string;
  @Input() turma:string;
  @Output() overlayCloseClick = new EventEmitter();
  image:any = './assets/imgs/noimage.png';
  imageToUpload = null ; 
  lista = '';
  listaRadioValues = [];
  //idMidia
  imageIdToUpload:number = null;
  clicked = [];
  clickedIndexed;
  options;
  zoomDiv = false;
  //texto
  texto = undefined;
  tipoTexto = false;
  tipoTextoFixo = false;
  tipoFoto = false;
  tipoHTML = false;
  tipoLista = false;
  tipoFotoGaleria = false;
  currentTipo = undefined;
  //idComunicacao
  currentComunicacao:number;
  currentActionDescricao = undefined;
  //notificar
  mandarNotificacao = false; 
  data;
  hora;
  //dataHotaPublicacao
  dataHora;
  expiravel = false;
  dataExpiracao = null;
  horaExpiracao = null;
   //dataHotaExpiracao
  dataHoraExpiracao = null;
  loader;
  postObject:{
    idComunicacao: number;
    dataHoraPublicacao: any;
    dataHoraExpiracao: any;
    notificar: boolean;
    texto: string;
    idMidia: number;
    distribuicoes: [{
      objeto: string;
      identificador: number;
    }];
  } = {
    idComunicacao: undefined,
    dataHoraPublicacao: undefined,
    dataHoraExpiracao: undefined,
    notificar: undefined,
    texto: undefined,
    idMidia: undefined,
    distribuicoes: [{
      objeto: undefined,
      identificador: undefined
    }]};
  enviarButton = undefined; 
  
  constructor(
    private http:HttpServiceProvider,
    private functions:Functions,
    private fileChooser:FileChooser,
    private sanitizer:DomSanitizer,
    private camera:Camera,
    private nativeFile:fileNative,
    private httpServ:HttpClient,
    private translate:TranslateService,
    private loadingCtrl:LoadingController,
    private toastCtrl:ToastController
  ) {
    
  }
  ngOnDestroy(){
  this.image= './assets/imgs/noimage.png';
  this.imageToUpload = null ; 
  this.lista = '';
  this.listaRadioValues = [];
  this.imageIdToUpload = null;
  this.clicked = [];
  this.clickedIndexed;
  this.options = undefined;
  this.zoomDiv = false;
  this.texto = undefined;
  this.tipoTexto = false;
  this.tipoTextoFixo = false;
  this.tipoFoto = false;
  this.tipoHTML = false;
  this.tipoLista = false;
  this.tipoFotoGaleria = false;
  this.currentTipo = undefined;
  this.currentComunicacao = undefined;
  this.currentActionDescricao = undefined;
  this.mandarNotificacao = false; 
  this.data;
  this.hora;
  this.dataHora;
  this.expiravel = false;
  this.dataExpiracao = null;
  this.horaExpiracao = null;
   this.dataHoraExpiracao = null;
    this.postObject = {
      idComunicacao: undefined,
      dataHoraPublicacao: undefined,
      dataHoraExpiracao: undefined,
      notificar: undefined,
      texto: undefined,
      idMidia: undefined,
      distribuicoes: [{
        objeto: undefined,
        identificador: undefined
      }]};
    this.enviarButton = undefined; 
  }
  ngOnInit(){
    this.createLoader();
    this.data = moment().format("YYYY-MM-DD");
    this.hora = moment().format('HH:mm');
    this.dataHora = this.functions.combineDateAndTime(this.data,this.hora);
    this.getOptions();
    console.log(this.objeto,this.turma);
  }
  close(){
    this.overlayCloseClick.emit(false);
  }

  getOptions(){
    let url = ENV.BASE_URL;
    let urn='/classe/atividade/professor/opcoes';
    this.http.specialGet(url,urn)
      .subscribe(
        data=>{
          data.forEach(
            options=>{
              let clicked={
                id:options.id,
                clicked:false
              }
              this.clicked.push(clicked);
              this.clickedIndexed = __.indexBy(this.clicked,'id');
            }
          )
          this.options = data;
          
          console.log(this.options);
        }
      )
  }

  buttonEffect(id){
    this.clickedIndexed[id].clicked = true;
    setTimeout(()=>{
      this.clickedIndexed[id].clicked = false;
    },300);
  }


  openCommunicationAction(option){
    let communicationDiv = document.getElementById('communicationDiv');
    communicationDiv.classList.add('noScroll');
    this.currentActionDescricao = option.descricao;
    this.currentComunicacao = option.id;
    this.expiravel = option.expiravel;
    this.lista = option.valor;

    this.currentTipo = option.tipo;
    switch (option.tipo){
      case 'TEXTO':{
        this.tipoTexto = true;
        break;
      }
      case 'FOTO':{
        this.tipoFoto = true;
        break;
      }
      case 'TEXTO_FIXO':{
        this.tipoTextoFixo = true;
        break;
      }
      case 'HTML':{
        this.tipoHTML = true;
        break;
      }
      case 'LISTA':{
        this.tipoLista = true;
        this.listaRadioValues = this.lista.split('|');
        console.log(this.listaRadioValues);
        break;
      }
      case 'FOTO_GALERIA':{
        this.tipoFotoGaleria = true;
        
        break;
      }
     
    }
    
    
  }
  closeCommunicationAction(tipo){
    document.getElementById('communicationDiv').classList.remove('noScroll');
    let communicationAction = document.getElementsByClassName('communicationAction')[0] as HTMLElement;
    
    communicationAction.animate([
      // keyframes
      { transform: 'scale(1)' }, 
      { transform: 'scale(0.05)' } 
    ], { 
      // timing options
      duration: 200,
      iterations: 1
    });
    this.currentComunicacao = undefined;
    this.currentTipo = undefined;
    
    switch (tipo){
      case 'TEXTO':{
        setTimeout(()=>{this.tipoTexto = false;},180);
        break;
      }
      case 'FOTO':{
        setTimeout(()=>{this.tipoFoto = false;},180);
        break;
      }
      case 'TEXTO_FIXO':{
        setTimeout(()=>{this.tipoTextoFixo = false;},180);
        break;
      }
      case 'HTML':{
        setTimeout(()=>{this.tipoHTML = false;},180);
        break;
      }
      case 'LISTA':{
        setTimeout(()=>{this.tipoLista = false;},180);
        break;
      }
      case 'FOTO_GALERIA':{
        setTimeout(()=>{this.tipoFotoGaleria = false;},180);
        break;
      }
    }
    this.unsetPostVariables();
  } 

    updateDateTime(){
      this.dataHora = this.functions.combineDateAndTime(this.data,this.hora);
    }

    updateDateTimeExpiracao(){
      if(this.dataExpiracao == null){
        this.functions.combineDateAndTime(this.data,this.horaExpiracao);
      }
      else if(this.horaExpiracao == null){
        this.functions.combineDateAndTime(this.dataExpiracao,'00:00');
      }
      else{
        this.dataHoraExpiracao = this.functions.combineDateAndTime(this.dataExpiracao,this.horaExpiracao);
      }
      console.log(this.dataHoraExpiracao);
    }
    
    textoClicked(textarea:HTMLElement){
      textarea.classList.add('editing');
    }
    textoDesfocado(textarea:HTMLElement){
      textarea.classList.remove('editing');
    }
    uploadImage(){
      this.loader.present();
      this.camera.getPicture({
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      correctOrientation:true
    
      }).then((imageData) => {
        
        this.imageToUpload = imageData;
         this.image = `data:image/jpeg;base64,${imageData}`;    /// passing it to variable to be used in html side
        this.uploadImageToDrive();
       }, (err) => {
          console.log(err);
      });
    }
    uploadImageByCamera(){
      this.loader.present();
      this.camera.getPicture({
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation:true
    
      }).then((imageData) => {
        
        this.imageToUpload = imageData;
         this.image = `data:image/jpeg;base64,${imageData}`;    /// passing it to variable to be used in html side
        this.uploadImageToDrive();
       }, (err) => {
          console.log(err);
      });
    }
    zoom(){
      this.zoomDiv = true;
    }
    zoomOut(){
      this.zoomDiv = false;
    }
   

    uploadImageToDrive(){
      let blob = this.base64toBlob(this.imageToUpload,'image/jpg');
      let file = this.blobToFile(blob,moment().format('YYYY:MM:DD hh:mm')+'.jpg');
      this.salvar(file)
        .subscribe(
          data=>{
            this.image = this.sanitizer.bypassSecurityTrustUrl(data.url);
            this.imageIdToUpload = data.id;
            this.dismissLoader()
          }
        );
          
              
    }

    sendMessage(){
      this.postObject.dataHoraExpiracao = this.dataHoraExpiracao;
      this.postObject.dataHoraPublicacao = this.dataHora;
      this.postObject.distribuicoes = [{objeto:this.objeto , identificador: parseInt(this.identificador)}];
      this.postObject.idComunicacao = this.currentComunicacao;
      this.postObject.idMidia = this.imageIdToUpload;
      this.postObject.notificar = this.mandarNotificacao;
      this.postObject.texto = this.texto;
      this.loader.present();
      this.postComunicacao(this.postObject);
      console.log(this.postObject);

    }
    public salvar(file: File): Observable<any> {
      let url = ENV.BASE_URL;
      let urn = '/google/midia/acesso';
      return this.http.specialGet(url, urn).flatMap(
          acesso => {

              return this.postGoogle(acesso.url, acesso.token, file).flatMap(
                  data => {
                      let url = ENV.BASE_URL;
                      let urn = `/google/midia/registrar/${data.id}`
                      return this.http.specialPost(url,urn, file.name);
                  }
              );
          }
      );
  }

  public postGoogle(url: string, token: string, body: any): Observable<any> {
      return this.httpServ.post(url, body, { headers: { 'Authorization': `Bearer ${token}` }, withCredentials: true });
  }

  public blobToFile = (theBlob: Blob, fileName:string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
}
   base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  var sliceSize = 1024;
  var byteCharacters = atob(base64Data);
  var bytesLength = byteCharacters.length;
  var slicesCount = Math.ceil(bytesLength / sliceSize);
  var byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
          bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  dismissLoader(){
    this.loader.dismiss();
    this.createLoader();
  }
  
  createLoader(){
    this.translate.get('loader_carregando')
    .subscribe(
      carregando=>{
        this.loader = this.loadingCtrl.create({
          spinner: "crescent",
          content:carregando
        });
      }
    );
    
   }


   postComunicacao(postObject){
     let url = ENV.BASE_URL;
     let urn = '/classe/atividade/professor';
     this.http.specialPost(url,urn,postObject)
      .subscribe(
        data=>{
          console.log(data);
          this.dismissLoader();
          let toast = this.toastCtrl.create( 
            {
              message: 'Comunicação enviada com sucesso!',
              duration:2500
            }
          );
            toast.present();
            this.close();
        },
        error=>{
          this.dismissLoader();
          let toast = this.toastCtrl.create( 
            {
              message: 'Houver algum erro, tente novamente',
              duration:2500
            }
          );
            toast.present();

        }
      )
   }

   unsetPostVariables(){
    this.dataHoraExpiracao = undefined;
    this.dataHora = undefined;
    
    this.currentComunicacao = undefined;
    this.imageIdToUpload = undefined;
    this.mandarNotificacao = false;
    this.texto = '';
   }
}


