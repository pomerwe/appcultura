import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarioProfessorPage } from './calendario-professor';

@NgModule({
  declarations: [
    CalendarioProfessorPage,
  ],
  imports: [
    IonicPageModule.forChild(CalendarioProfessorPage),
  ],
})
export class CalendarioProfessorPageModule {}
