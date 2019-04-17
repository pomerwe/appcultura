import { Injectable } from "@angular/core";
import { Observable } from "../../node_modules/rxjs";
import { ISubscription } from "../../node_modules/rxjs/Subscription";


/*
    Classe de funções aleatórias que podem ser de utilidade para usos aleatórios
*/


@Injectable()
export class Functions{
    scrollObservable:Observable<any>;
    scrollSubscription:ISubscription;

    //Função que transforma cada primeira letra de uma
    // palavra dentro de uma frase string em letra maiúscula.
   public nomes(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        // Directly return the joined string
        return splitStr.join(' '); 
}

    //Função criada pra comparar 2 arrays identicos. 
    //Pra falar a verdade use a Library Underscore, é bem melhor.
    public compararArrays(value1, value2){
        if(value1 === value2) return true;
        if( value1 == null || value2 == null ) return false;
        if(value1 == undefined || value2 == undefined) return false;
        for(let i=0 ; value1.length > i ; i++ ){
            if(value1[i]!=value2[i]) return false;
        }
        return true;
    }

   
    //Função que adiciona uma classe css criada para estilizar o ScrollContent que vem do Ion-Content
    scrollActive(event){
        if(this.scrollObservable) this.scrollObservable = undefined;
        if(this.scrollSubscription) this.scrollSubscription.unsubscribe();        
        event.classList.remove('inactive');
        event.classList.add('scrolling');
        
      }
      //Função que remove uma classe css criada para estilizar o ScrollContent que vem do Ion-Content
      scrollInactive(event){
        this.scrollObservable = this.observableScroll(event);
        setTimeout(()=>{
        if(this.scrollObservable !=undefined) this.scrollSubscription = this.scrollObservable.subscribe();
      },150)
      }
    //Obersevable criado para impedir que a scrollbar sumisse ao soltar o click. 
      observableScroll(event):Observable<any>{
         return new Observable( 
           obs =>{
            obs.next(event.classList.remove('scrolling')),
            obs.next(event.classList.add('inactive')),
            obs.complete;
    
         })
      }
     
}