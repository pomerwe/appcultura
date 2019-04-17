import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DeviceServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DeviceServiceProvider {

  platform;



  constructor(public http: HttpClient) {
    
  }


  getPlatform(){
    return this.platform;
  }
  setPlatform(platform){
    this.platform = platform;
  }

}
