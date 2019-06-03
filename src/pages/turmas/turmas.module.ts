import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TurmasPage } from './turmas';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TurmasPage,
  ],
  imports: [
    IonicPageModule.forChild(TurmasPage),
    TranslateModule
  ],
})
export class TurmasPageModule {}
