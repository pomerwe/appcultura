import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TurmaPage } from './turma';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TurmaPage,
  ],
  imports: [
    IonicPageModule.forChild(TurmaPage),
    TranslateModule
  ],
})
export class TurmaPageModule {}
