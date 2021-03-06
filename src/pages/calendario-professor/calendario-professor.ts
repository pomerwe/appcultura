import { Component, ViewChild, } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, MenuController } from 'ionic-angular';
import { TransitionsProvider } from '../../providers/transitions/transitions';
import * as __ from 'underscore';
import { Functions } from '../../functions/functions';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { environment as env } from '../../environments/environment';
import { ISubscription } from 'rxjs/Subscription';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the CalendarioProfessorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendario-professor',
  templateUrl: 'calendario-professor.html',
})
export class CalendarioProfessorPage {
  @ViewChild(Navbar) navBar:Navbar; 
  //Verifica se o ano já foi carregado
  isLoaded = false;
  //Variávei de controle da Div de efeito dos botões
  arrowBack = false;
  arrowForward = false;
  reloadButton = false;

  //Variável de controle da div de Ajuda
  helpActive = false;
  //Loading controller
  carregando = false;

  //Options do get locale string
  mesLocaleDateStringOptions = { month: 'long' };

  //Array de calendário
  calendario = [];

  //Dia de hoje
  hoje:Date = new Date();

  //Nome do mês
  mesLabel:string;

  //Dia que foi selecionado anteriormente
  previousSelected = undefined;

  //Ano inteiro
  year;

  //Variável de range minimo de ano
  // backYearRange;

  //Variável dfe range máximo de ano
  // forwardYearRange;

  //Ano atual selecionado
  currentYear = 0;

  //Index correspondente ao mês no getMonth do date
  currentMonthIndex = 0;

  //Mês inteiro 
  currentMonth;

  //Vetor que define os dias que serão mostrados no html
  calendarDaysDisplay = [
    {day:'dom',days:[]},
    {day:'seg',days:[]},
    {day:'ter',days:[]},
    {day:'qua',days:[]},
    {day:'qui',days:[]},
    {day:'sex',days:[]},
    {day:'sáb',days:[]}];
  //Vetor dos dias que preencherão o calendário com os dias do mes anterior
  calendarDaysFakeDisplayTop = [
    {day:'dom',days:[]},
    {day:'seg',days:[]},
    {day:'ter',days:[]},
    {day:'qua',days:[]},
    {day:'qui',days:[]},
    {day:'sex',days:[]},
    {day:'sáb',days:[]}];
    //Vetor dos dias que preencherão o calendário com os dias do mes seguinte
  calendarDaysFakeDisplayBottom = [
    {day:'dom',days:[]},
    {day:'seg',days:[]},
    {day:'ter',days:[]},
    {day:'qua',days:[]},
    {day:'qui',days:[]},
    {day:'sex',days:[]},
    {day:'sáb',days:[]}];
  //A seguir temos vetores dos dias que preencherão o calendário no html com o index baseado no dia
  calendarDaysDisplayIndexed;
  calendarFakeDaysDisplayIndexedTop;
  calendarFakeDaysDisplayIndexedBottom;

  //Array de subscriptions
  subscriptions:Array<ISubscription> = [];

  //Eventos que serão mostrados no html ao selecionar um dia
  eventsDisplay;

  constructor(  
    public navCtrl: NavController, 
    public navParams: NavParams,
    private transitions:TransitionsProvider,
    private functions:Functions,
    private http:HttpServiceProvider,
    private screenOrientation: ScreenOrientation,
    private menu:MenuController,
    private translate:TranslateService
    ) {
     translate.get('calendario_meslabelparam')
      .subscribe(
        data=>{
          this.mesLabel = this.functions.nomes(this.hoje.toLocaleDateString(data,this.mesLocaleDateStringOptions));

        }
      );
     this.currentMonthIndex = this.hoje.getMonth();
     this.currentYear = this.hoje.getFullYear();
     this.calendarDaysDisplayIndexed = __.indexBy(this.calendarDaysDisplay,'day');
     this.calendarFakeDaysDisplayIndexedTop = __.indexBy(this.calendarDaysFakeDisplayTop,'day');
     this.calendarFakeDaysDisplayIndexedBottom = __.indexBy(this.calendarDaysFakeDisplayBottom,'day');
     
  }

  ionViewWillEnter(){
    this.menu.swipeEnable(false);
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    let pushParam = this.navParams.get('push');
    if(pushParam!=undefined){
      if(pushParam==true) {
        this.transitions.push();
        this.navParams.data = {push:false};
      }  
    } 
    if(this.isLoaded == false)this.getFullYear(this.currentYear);
    else this.reloadMonth();
  }
  
  ionViewDidLoad() {
    
    //Cancela a animação feita pelo Ionic
    this.navBar.backButtonClick = (e:UIEvent) => {
      this.navCtrl.pop({animate:false});
    };
    
  }

  ionViewWillLeave(){
    this.menu.swipeEnable(true);
    this.screenOrientation.unlock();
    let pushParam = this.navParams.get('push');
    if(pushParam==undefined) this.transitions.back();
    else if(pushParam!=true) this.transitions.back();
    this.subscriptions.forEach(
      subs=>{subs.unsubscribe();}
    );
  }
  
  getFullYear(year){
  //getFullYear(yearStart,yearEnd){
    // this.backYearRange = yearStart;
    // this.forwardYearRange = yearEnd;
    //let year = yearStart;
    // while(year<=yearEnd){
      let y = {
        year:year,
        months:[
        ]
      }
      for(let i = 0 ; i <= 11; i++){
        let month = {
          month:i,
          days:[]
        };
        let date = new Date(y.year,month.month,1);
        let days = [];
        while(month.month == date.getMonth()){
          
          days.push(new Date(date));
          date.setDate(date.getDate() + 1);
        }
        month.days = days;
        y.months.push(month);
      }
      this.year = y;
      // this.yearsIndexed = __.indexBy(this.years,'year');
     //year++
    // }
    this.getMonth(this.currentMonthIndex);
    
  }

  getMonth(monthIndex){
    
     this.currentMonth = this.year.months[monthIndex];
    
    

    let fd = this.currentMonth.days[0].toLocaleDateString('pt-BR',{weekday:'short'});
    switch (fd){
      case 'dom':{
        
        break;
      }
      case 'seg':{
        let days = [31];
        this.calendarFakeDaysDisplayIndexedTop['dom'].days.push(days[0]);
        
        break;
      }
      case 'ter':{
        let days = [30,31];
        this.calendarFakeDaysDisplayIndexedTop['dom'].days.push(days[0]);
        this.calendarFakeDaysDisplayIndexedTop['seg'].days.push(days[1]);
        break;
      }
      case 'qua':{
        let days = [29,30,31];
        this.calendarFakeDaysDisplayIndexedTop['dom'].days.push(days[0]);
        this.calendarFakeDaysDisplayIndexedTop['seg'].days.push(days[1]);
        this.calendarFakeDaysDisplayIndexedTop['ter'].days.push(days[2]);
        break;
      }
      case 'qui':{
        let days = [28,29,30,31]
        this.calendarFakeDaysDisplayIndexedTop['dom'].days.push(days[0]);
        this.calendarFakeDaysDisplayIndexedTop['seg'].days.push(days[1]);
        this.calendarFakeDaysDisplayIndexedTop['ter'].days.push(days[2]);
        this.calendarFakeDaysDisplayIndexedTop['qua'].days.push(days[3]);
        break;
      }
      case 'sex':{
        let days = [27,28,29,30,31]
        this.calendarFakeDaysDisplayIndexedTop['dom'].days.push(days[0]);
        this.calendarFakeDaysDisplayIndexedTop['seg'].days.push(days[1]);
        this.calendarFakeDaysDisplayIndexedTop['ter'].days.push(days[2]);
        this.calendarFakeDaysDisplayIndexedTop['qua'].days.push(days[3]);
        this.calendarFakeDaysDisplayIndexedTop['qui'].days.push(days[4]);

        break;
      }
      case 'sáb':{
        let days = [26,27,28,29,30,31]
        this.calendarFakeDaysDisplayIndexedTop['dom'].days.push(days[0]);
        this.calendarFakeDaysDisplayIndexedTop['seg'].days.push(days[1]);
        this.calendarFakeDaysDisplayIndexedTop['ter'].days.push(days[2]);
        this.calendarFakeDaysDisplayIndexedTop['qua'].days.push(days[3]);
        this.calendarFakeDaysDisplayIndexedTop['qui'].days.push(days[4]);
        this.calendarFakeDaysDisplayIndexedTop['sex'].days.push(days[5]);

        break;
      }
    }
    
    let lastDay = this.currentMonth.days.length-1;
    let ld = this.currentMonth.days[lastDay].toLocaleDateString('pt-BR',{weekday:'short'});
    switch (ld){
      case 'dom':{
        let days = [1,2,3,4,5,6]
        this.calendarFakeDaysDisplayIndexedBottom['seg'].days.push(days[0]);
        this.calendarFakeDaysDisplayIndexedBottom['ter'].days.push(days[1]);
        this.calendarFakeDaysDisplayIndexedBottom['qua'].days.push(days[2]);
        this.calendarFakeDaysDisplayIndexedBottom['qui'].days.push(days[3]);
        this.calendarFakeDaysDisplayIndexedBottom['sex'].days.push(days[4]);
        this.calendarFakeDaysDisplayIndexedBottom['sáb'].days.push(days[5]);

        
        break;
      }
      case 'seg':{
        let days = [1,2,3,4,5];
        this.calendarFakeDaysDisplayIndexedBottom['ter'].days.push(days[0]);
        this.calendarFakeDaysDisplayIndexedBottom['qua'].days.push(days[1]);
        this.calendarFakeDaysDisplayIndexedBottom['qui'].days.push(days[2]);
        this.calendarFakeDaysDisplayIndexedBottom['sex'].days.push(days[3]);
        this.calendarFakeDaysDisplayIndexedBottom['sáb'].days.push(days[4]);
        
        
        break;
      }
      case 'ter':{
        let days = [1,2,3,4];
        this.calendarFakeDaysDisplayIndexedBottom['qua'].days.push(days[0]);
        this.calendarFakeDaysDisplayIndexedBottom['qui'].days.push(days[1]);
        this.calendarFakeDaysDisplayIndexedBottom['sex'].days.push(days[2]);
        this.calendarFakeDaysDisplayIndexedBottom['sáb'].days.push(days[3]);
        
        break;
      }
      case 'qua':{
        let days = [1,2,3];
        this.calendarFakeDaysDisplayIndexedBottom['qui'].days.push(days[0]);
        this.calendarFakeDaysDisplayIndexedBottom['sex'].days.push(days[1]);
        this.calendarFakeDaysDisplayIndexedBottom['sáb'].days.push(days[2]);
        break;
      }
      case 'qui':{
        
        let days = [1,2];
        this.calendarFakeDaysDisplayIndexedBottom['sex'].days.push(days[0]);
        this.calendarFakeDaysDisplayIndexedBottom['sáb'].days.push(days[1]);
        break;
      }
      case 'sex':{
        
        let days = [1];
        this.calendarFakeDaysDisplayIndexedBottom['sáb'].days.push(days[0]);
        break;
      }
      case 'sáb':{
        break;
      }
    }
        
      
    
    
      
    let events = [];
    this.currentMonth.days.forEach(
      day=>{         
        let eventsTemplate = {
          dia:day.getDate(),
          eventos:[]
        }
        events.push(eventsTemplate);

        let d = day.toLocaleDateString('pt-BR',{weekday:'short'});
        this.calendarDaysDisplayIndexed[d].days.push(day.getDate());
        
      }
    );

    this.eventsDisplay = __.indexBy(events,'dia');
    this.getClasses();
  }


  increaseMonth(){
    this.unsetEventsClasses();
    document.getElementById('events').innerHTML = '';
    this.subscriptions.forEach(
      subs=>{subs.unsubscribe();}
    );

    this.carregando = true;
    this.unsetDays();
    
       
    if(this.currentMonthIndex == 11){
      this.currentYear++; 
      this.currentMonthIndex = 0;
      this.getFullYear(this.currentYear);
      
    }
    else{
      this.currentMonthIndex = this.currentMonthIndex + 1;
      this.getMonth(this.currentMonthIndex);

    }
    this.translate.get('calendario_meslabelparam')
      .subscribe(
        data=>{
          this.mesLabel = this.functions.nomes(new Date(this.currentYear , this.currentMonthIndex).toLocaleDateString(data,this.mesLocaleDateStringOptions));

        }
      );
    

  
  }
  decreaseMonth(){
    this.unsetEventsClasses();
    document.getElementById('events').innerHTML = '';
    this.subscriptions.forEach(
      subs=>{subs.unsubscribe();}
    );

    this.carregando = true;
    this.unsetDays();
   
    if(this.currentMonthIndex == 0){
      this.currentYear--;
      this.currentMonthIndex = 11;
      this.getFullYear(this.currentYear);
      
    }
    else{
      this.currentMonthIndex = this.currentMonthIndex - 1;
      this.getMonth(this.currentMonthIndex);

    } 
    
    this.translate.get('calendario_meslabelparam')
      .subscribe(
        data=>{
          this.mesLabel = this.functions.nomes(new Date(this.currentYear , this.currentMonthIndex).toLocaleDateString(data,this.mesLocaleDateStringOptions));

        }
      );
    


    
  
  }

  reloadMonth(){
    this.unsetEventsClasses();
    document.getElementById('events').innerHTML = '';
    this.subscriptions.forEach(
      subs=>{subs.unsubscribe();}
    );

    this.carregando = true;
    this.unsetDays();
    this.getMonth(this.currentMonthIndex);

    
    
    
    
    

  }
  unsetDays(){
    
    Object.keys(this.calendarDaysDisplayIndexed)
      .forEach(
        day=>{
          while(this.calendarDaysDisplayIndexed[day].days.length>0){
            this.calendarDaysDisplayIndexed[day].days.pop();
          }
        }
        );
    Object.keys(this.calendarDaysDisplayIndexed)
    .forEach(
      day=>{
        while(this.calendarFakeDaysDisplayIndexedTop[day].days.length>0){
          this.calendarFakeDaysDisplayIndexedTop[day].days.pop();
        }
      }
      );
    Object.keys(this.calendarDaysDisplayIndexed)
    .forEach(
      day=>{
        while(this.calendarFakeDaysDisplayIndexedBottom[day].days.length>0){
          this.calendarFakeDaysDisplayIndexedBottom[day].days.pop();
        }
      }
      );

    
  }


  eventsClassAdd(dia,mes,ano,event){
    let classes = [];
    switch (event){
      case 'VERDE':{
        classes.push('green');
        break;
      }
      case 'AZUL':{
        classes.push('blue');
        break;
      }
      case 'VERMELHO':{
        classes.push('red');
        break;
      }
      case 'CINZA':{
        classes.push('gray');
        break;
      }
    }
    
    if(dia == this.hoje.getDate() && mes == this.hoje.getMonth() && ano == this.hoje.getFullYear()) classes.push('hoje');
    classes.forEach(
      classe=>{
        document.getElementById(dia.toString()).classList.add(classe);
      }
    )
    let findClasses = [];
    for(let i = 0 ; i < document.getElementById(dia.toString()).classList.length ; i++){
      findClasses.push(document.getElementById(dia.toString()).classList[i])
    }
    if(__.indexOf(findClasses,'red')!=-1){
      document.getElementById(dia.toString()).classList.remove('green');
      document.getElementById(dia.toString()).classList.remove('gray');
      document.getElementById(dia.toString()).classList.remove('blue');
    }
    else if(__.indexOf(findClasses,'blue')!=-1){
      document.getElementById(dia.toString()).classList.remove('green');
      document.getElementById(dia.toString()).classList.remove('gray');
     
    }
    else if(__.indexOf(findClasses,'gray')!=-1){
      document.getElementById(dia.toString()).classList.remove('green');
      
    }

  }

  getClasses(){
    if(this.carregando==false)this.carregando = true;
    let url= env.BASE_URL;
    let urn =  '/classe/calendario';
    let params = {
      'ano':`${this.currentYear}`,
      'mes':`${this.currentMonthIndex+1}`
    }
    //Get especial que permite buscar de urls diferentes do schema movel
    this.subscriptions.push(this.http.specialGet(url,urn,params)
      .subscribe(
        data=>{
          data.forEach(
            evento=>{
              let dia = new Date(evento.dataHoraInicio).getDate();
              this.eventsClassAdd(dia,this.currentMonthIndex,this.currentYear,evento.corEvento);
              let corEvento;
              if(evento.corEvento.match('VERDE')!==null) corEvento = 'greenEvent';
              else if(evento.corEvento.match('AZUL')!==null) corEvento = 'blueEvent';
              else if (evento.corEvento.match('CINZA')!==null) corEvento = 'grayEvent';
              else corEvento = 'redEvent';
              let eventoObj={
                detalheEvento:evento.detalheEvento,
                corEvento:corEvento,
                codigoAula:evento.codigoAula,
                base:evento.base,
                codigoTurma:evento.codigoTurma,
                dataHoraInicio:evento.dataHoraInicio
              }
              this.eventsDisplay[dia].eventos.push(eventoObj);
              this.eventsDisplay[dia].eventos = __.sortBy(this.eventsDisplay[dia].eventos,'dataHoraInicio');
            }
          )
          this.calendario = data;
          if(this.previousSelected == undefined)this.showEvents(this.hoje.getDate());
          
          this.carregando = false;
          this.isLoaded = true;
        }
      )
    )
  }

  showEvents(dia){
    if(this.previousSelected!= undefined && this.previousSelected!=dia) document.getElementById(this.previousSelected).classList.remove('selected');
    document.getElementById(dia).classList.add('selected');
    this.translate.get(['calendario_meslabelparam','calendario_displayhoje'])
    .subscribe(data=>{
      let diasemana = this.functions.nomes(
        new Date(this.currentYear,this.currentMonthIndex,dia).toLocaleDateString(data.calendario_meslabelparam,{weekday:'long'}));
        document.getElementById('events').innerHTML = '';
        document.getElementById('events').innerHTML = `<span class='eventsDay' ion-col col-12>${dia < 10 ? '0'+dia : dia}/${(this.currentMonthIndex+1) < 10 ? '0'+(this.currentMonthIndex+1) : (this.currentMonthIndex+1)} - ${dia == this.hoje.getDate() && this.currentMonth.month == this.hoje.getMonth() && this.currentYear == this.hoje.getFullYear()  ? `${data.calendario_displayhoje} - `: ''} ${diasemana}</span> `;
    });
    
    
    if(this.eventsDisplay[dia].eventos.length>0){
      let cods = [];
      this.eventsDisplay[dia].eventos.forEach(
        evento=>{
          document.getElementById('events').innerHTML += `<span class='event ${evento.corEvento}' ion-col col-5 id='${evento.codigoAula == null ? evento.codigoTurma+evento.dataHoraInicio : evento.codigoAula }'> ${evento.detalheEvento}</span>`;
          let medidadrastica= {
            evento:evento,
            codigoAula:evento.codigoAula,
            cor:evento.corEvento,
            base:evento.base,
            codigoTurma:evento.codigoTurma,
            dataHoraInicio:evento.dataHoraInicio
            
          }
          cods.push(medidadrastica);
        }
      );
      cods.forEach(
        t=>{
          //TODO: Assim que abrir a chamada, gerar um código aula caso não tenha ainda
          if(t.codigoAula !==null){
            
              document.getElementById(t.codigoAula).addEventListener("click",this.chamada.bind(this,t.evento));
            
          }
           else{
            this.setCodigoAula(t)
              .then(
                t=>{
                  document.getElementById(t.codigoTurma+t.dataHoraInicio).addEventListener("click",this.chamada.bind(this,t.evento));

                }
              )
          
          }
        }
        );

    }
    else{
      this.translate.get('calendario_noeventstoday')
      .subscribe(
        semeventoshoje=>{
          document.getElementById('events').innerHTML += `<span class='noEventsMsg event' ion-col col-12>${semeventoshoje}</span>`

        }
      )
    }
    
    this.previousSelected = dia;
  }

  unsetEventsClasses(){
    let days = [];
    for(let i = 1 ; i<=31 ; i++){
      days.push(i);
    }
    days.forEach(
      dia=>{
        if(document.getElementById(dia.toString())){
          document.getElementById(dia.toString()).classList.remove('green');
          document.getElementById(dia.toString()).classList.remove('red');
          document.getElementById(dia.toString()).classList.remove('gray');
          document.getElementById(dia.toString()).classList.remove('selected');
          document.getElementById(dia.toString()).classList.remove('blue');
        }

        
      }
    )
    
  }

  chamada(evento){
   this.navCtrl.push('ChamadaPage',{push:true,chamada:evento});
  }

  activeHelp(scrollContent){
    scrollContent.classList.add('helpActive');
    this.helpActive = true;
  }
  deactiveHelp(scrollContent){
    scrollContent.classList.remove('helpActive');
    this.helpActive = false;
  }

  setCodigoAula(evento):Promise<any>{
    let url = env.BASE_URL;
    let urn = '/classe/aula';
    let params = {
      'codigoTurma' : evento.codigoTurma,
      'base' : evento.base,
      'dataHoraInicio' : evento.dataHoraInicio
    }
    let eventoObj={
      evento:evento.evento,
      codigoAula:evento.codigoAula,
      codigoTurma:evento.codigoTurma,
      dataHoraInicio:evento.dataHoraInicio
    }
    return new Promise((resolve)=>{
      this.subscriptions.push(this.http.specialGet(url,urn,params)
      .subscribe(
        evento=>{
          eventoObj.codigoAula = evento.codigoAula;
          eventoObj.evento.codigoAula = evento.codigoAula;
          resolve(eventoObj);
        }
      ))
    });
    
  }
  button(arrow){
    if(arrow.match('arrowForward')){ 
      this.arrowForward = true ; 
      setTimeout(()=>this.arrowForward=false,
      600);
    }
    else if(arrow.match('arrowBack')){ 
      this.arrowBack = true ; 
      setTimeout(()=>this.arrowBack=false,
      600);
    }
    else if(arrow.match('reloadButton')){ 
      this.reloadButton = true ; 
      setTimeout(()=>this.reloadButton=false,
      600);
    }
    
  }

}
