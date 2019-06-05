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
      duration: 300,
      slowdownfactor: 4,
      iosdelay: 65,
      androiddelay: 0,
    }; 
    this.backAnimationOptions={
      direction: 'right',
      duration: 300,
      slowdownfactor: 4,
      iosdelay: 65,
      androiddelay: 0,
    }; 
  }


  push(){
    this.nativePageTransitions.slide(this.pushAnimationOptions);
  }

  back(){
    this.nativePageTransitions.slide(this.backAnimationOptions);
  }

  quickPush(){
    let pushAnimationOptions={
      direction: 'left',
      duration: 220,
      slowdownfactor: 4,
      iosdelay: 130,
      androiddelay: 130,
      fixedPixelsTop: 56,
    }; 
    this.nativePageTransitions.slide(pushAnimationOptions);
  }
  quickBack(){
    let backAnimationOptions={
      direction: 'right',
      duration: 220,
      slowdownfactor: 4,
      iosdelay: 130,
      androiddelay: 130,
      fixedPixelsTop: 56,
    }; 
    this.nativePageTransitions.slide(backAnimationOptions);
  }
}
