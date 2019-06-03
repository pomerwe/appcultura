import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfessorPage } from './professor';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ProfessorPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfessorPage),
    TranslateModule
  ],
})
export class ProfessorPageModule {}
