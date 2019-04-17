import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TurmaPage } from './turma';

@NgModule({
  declarations: [
    TurmaPage,
  ],
  imports: [
    IonicPageModule.forChild(TurmaPage),
  ],
})
export class TurmaPageModule {}
