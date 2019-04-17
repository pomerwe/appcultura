import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';

/*
  Generated class for the LocalStorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocalStorageProvider {

  keepConnected = false;
  token;
  constructor(
    public localStorage:NativeStorage,) {
  }

  isEnabled() {
    return this.keepConnected;
  }

  setToken(token){
    this.token=token;
  }

  getToken(){
    return this.token;
  }

  logout(){
    //Set a page root do app para LoginPage novamente
    this.localStorage.remove('keepConnected');
    this.localStorage.remove('rootPage');
    this.localStorage.remove('contas');
    this.localStorage.remove('turmas');
    this.localStorage.remove('user');
  }

}
