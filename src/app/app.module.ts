import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { HttpServiceProvider } from '../providers/http-service/http-service';

import { HttpClientModule } from '@angular/common/http';
import { Functions } from '../functions/functions';
import { LoginServiceProvider } from '../providers/login-service/login-service';
import { ContasChooseProvider } from '../providers/contas-choose/contas-choose';
import { AlunoProvider } from '../providers/aluno/aluno';
import { UtilServiceProvider } from '../providers/util-service/util-service';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';


@NgModule({
  declarations: [
    MyApp
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpServiceProvider,
    AuthServiceProvider,
    Functions,
    LoginServiceProvider,
    ContasChooseProvider,
    AlunoProvider,
    UtilServiceProvider
  ]
})
export class AppModule {}
