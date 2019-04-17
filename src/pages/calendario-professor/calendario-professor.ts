import { Component, ViewChild, } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, DateTime } from 'ionic-angular';
import { TransitionsProvider } from '../../providers/transitions/transitions';
import * as __ from 'underscore';
import { Functions } from '../../functions/functions';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { environment as env } from '../../environments/environment';
import { ISubscription } from 'rxjs/Subscription';
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
  helpActive = false;
  carregando = false;
  mesLocaleDateStringOptions = { month: 'long' };
  calendario = [];
  hoje:Date = new Date();
  mesLabel:string;
  previousSelected = undefined;
  year;
  backYearRange;
  forwardYearRange;
  currentYear = 2019;
  currentMonthIndex;
  currentMonth;
  calendarDaysDisplay = [
    {day:'dom',days:[]},
    {day:'seg',days:[]},
    {day:'ter',days:[]},
    {day:'qua',days:[]},
    {day:'qui',days:[]},
    {day:'sex',days:[]},
    {day:'sáb',days:[]}];
  calendarDaysFakeDisplayTop = [
    {day:'dom',days:[]},
    {day:'seg',days:[]},
    {day:'ter',days:[]},
    {day:'qua',days:[]},
    {day:'qui',days:[]},
    {day:'sex',days:[]},
    {day:'sáb',days:[]}];
  calendarDaysFakeDisplayBottom = [
    {day:'dom',days:[]},
    {day:'seg',days:[]},
    {day:'ter',days:[]},
    {day:'qua',days:[]},
    {day:'qui',days:[]},
    {day:'sex',days:[]},
    {day:'sáb',days:[]}];
  calendarDaysDisplayIndexed;
  calendarFakeDaysDisplayIndexedTop;
  calendarFakeDaysDisplayIndexedBottom;
  subscriptions:Array<ISubscription> = [];

  eventsDisplay;

  constructor(  
    public navCtrl: NavController, 
    public navParams: NavParams,
    private transitions:TransitionsProvider,
    private functions:Functions,
    private http:HttpServiceProvider,
    ) {
     this.mesLabel = this.functions.nomes(this.hoje.toLocaleDateString('pt-BR',this.mesLocaleDateStringOptions));
     this.currentMonthIndex = this.hoje.getMonth();
     this.currentYear = this.hoje.getFullYear();
     this.calendarDaysDisplayIndexed = __.indexBy(this.calendarDaysDisplay,'day');
     this.calendarFakeDaysDisplayIndexedTop = __.indexBy(this.calendarDaysFakeDisplayTop,'day');
     this.calendarFakeDaysDisplayIndexedBottom = __.indexBy(this.calendarDaysFakeDisplayBottom,'day');
     
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
    this.getFullYear(this.currentYear);
  }

  ionViewWillLeave(){
    this.transitions.back();
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
    
    this.mesLabel = this.functions.nomes(new Date(this.currentYear , this.currentMonthIndex).toLocaleDateString('pt-BR',this.mesLocaleDateStringOptions));

  
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
    
    
    this.mesLabel = this.functions.nomes(new Date(this.currentYear , this.currentMonthIndex).toLocaleDateString('pt-BR',this.mesLocaleDateStringOptions));


    
  
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
    document.getElementById(dia.toString()).classList.forEach(
      cl => findClasses.push(cl)
    );
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
                base:evento.base
              }
              this.eventsDisplay[dia].eventos.push(eventoObj);

            }
          )
          this.calendario = data;
          if(this.previousSelected == undefined)this.showEvents(this.hoje.getDate());
          
          this.carregando = false;
        }
      )
    )
  }

  showEvents(dia){
    if(this.previousSelected!= undefined && this.previousSelected!=dia) document.getElementById(this.previousSelected).classList.remove('selected');
    document.getElementById(dia).classList.add('selected');
    let diasemana = this.functions.nomes(
      new Date(this.currentYear,this.currentMonthIndex,dia).toLocaleDateString('pt-BR',{weekday:'long'}));
    document.getElementById('events').innerHTML = '';
    document.getElementById('events').innerHTML = `<span class='eventsDay' ion-col col-12>${dia < 10 ? '0'+dia : dia}/${this.currentMonthIndex < 10 ? '0'+this.currentMonthIndex : this.currentMonthIndex} - ${dia == this.hoje.getDate() && this.currentMonth == this.hoje.getMonth() && this.currentYear == this.hoje.getFullYear()  ? "Hoje - ": ''} ${diasemana}</span> `;
    if(this.eventsDisplay[dia].eventos.length>0){
      let cods = [];
      this.eventsDisplay[dia].eventos.forEach(
        evento=>{
          document.getElementById('events').innerHTML += `<span class='event ${evento.corEvento}' ion-col col-5 id='${evento.codigoAula}'> ${evento.detalheEvento}</span>`;
          let medidadrastica= {
            evento:evento,
            codigoAula:evento.codigoAula
          }
          cods.push(medidadrastica);
        }
      );
      cods.forEach(t=>{document.getElementById(t.codigoAula).addEventListener("click",this.chamada.bind(this,t.evento))})  
    }
    else{
       document.getElementById('events').innerHTML += `<span class='noEventsMsg event' ion-col col-12>Você não possui eventos nesse dia!</span>`
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
        }
        
      }
    )
    
  }

  chamada(evento){
    console.log(evento);
  }

  activeHelp(scrollContent){
    scrollContent.classList.add('helpActive');
    this.helpActive = true;
  }
  deactiveHelp(scrollContent){
    scrollContent.classList.remove('helpActive');
    this.helpActive = false;
  }
}
