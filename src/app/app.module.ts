import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { File } from '@ionic-native/file';
import { Clipboard } from '@ionic-native/clipboard';
import { HttpServiceProvider } from '../providers/http-service/http-service';
import {LOCALE_ID} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Functions } from '../functions/functions';
import { LoginServiceProvider } from '../providers/login-service/login-service';
import { ContasChooseProvider } from '../providers/contas-choose/contas-choose';
import { AlunoProvider } from '../providers/aluno/aluno';
import { UtilServiceProvider } from '../providers/util-service/util-service';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FileTransfer} from '@ionic-native/file-transfer';
import { Device } from '@ionic-native/device';
import { DeviceServiceProvider } from '../providers/device-service/device-service';
import { FileOpener } from '@ionic-native/file-opener';
import { Network } from '@ionic-native/network';
import { NativeStorage } from '@ionic-native/native-storage';
import { NetworkCheckServiceProvider } from '../providers/network-check-service/network-check-service';
import { NavigationBar } from '@ionic-native/navigation-bar';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AutoReloadDiaDiaProvider } from '../providers/auto-reload-dia-dia/auto-reload-dia-dia';
registerLocaleData(localePt);
import { BackgroundMode } from '@ionic-native/background-mode/';
import { Push } from '@ionic-native/push';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
import { ProfessorProvider } from '../providers/professor/professor';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { TransitionsProvider } from '../providers/transitions/transitions';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Keyboard } from '@ionic-native/keyboard';
@NgModule({
  declarations: [
    MyApp,
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      scrollPadding: true,
      scrollAssist: false
    }),
    HttpClientModule,
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    },
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpServiceProvider,
    AuthServiceProvider,
    Functions,
    LoginServiceProvider,
    ContasChooseProvider,
    AlunoProvider,
    UtilServiceProvider,
    Clipboard,
    FileTransfer,
    File,
    Device,
    DeviceServiceProvider,
    FileOpener,
    NativeStorage,
    Network,
    NetworkCheckServiceProvider,
    NavigationBar,
    LocalNotifications,
    AutoReloadDiaDiaProvider,
    BackgroundMode,
    Push,
    LocalStorageProvider,
    ProfessorProvider,
    NativePageTransitions,
    TransitionsProvider,
    ScreenOrientation,
    Keyboard
  ]
})
export class AppModule {}
