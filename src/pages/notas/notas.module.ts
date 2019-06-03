import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotasPage } from './notas';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    NotasPage,
  ],
  imports: [
    IonicPageModule.forChild(NotasPage),
    TranslateModule
  ],
})
export class NotasPageModule {}
