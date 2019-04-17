import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NativePageTransitions, NativeTransitionOptions } from '../../../node_modules/@ionic-native/native-page-transitions';

/*
  Generated class for the TransitionsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TransitionsProvider {

  pushAnimationOptions:NativeTransitionOptions;
  backAnimationOptions:NativeTransitionOptions;
    constructor(
      private nativePageTransitions: NativePageTransitions
    ) {
    this.pushAnimationOptions={
      direction: 'left',
      duration: 320,
      slowdownfactor: 4,
      iosdelay: 0,
      androiddelay: 0,
    }; 
    this.backAnimationOptions={
      direction: 'right',
      duration: 320,
      slowdownfactor: 4,
      iosdelay: 0,
      androiddelay: 0,
    }; 
  }


  push(){
    this.nativePageTransitions.slide(this.pushAnimationOptions);
  }

  back(){
    this.nativePageTransitions.slide(this.backAnimationOptions);
  }
}
