import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarioProfessorPage } from './calendario-professor';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CalendarioProfessorPage,
  ],
  imports: [
    IonicPageModule.forChild(CalendarioProfessorPage),
    TranslateModule
  ],
})
export class CalendarioProfessorPageModule {}
