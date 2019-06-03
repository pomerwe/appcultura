import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadaPage } from './chamada';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChamadaPage,
  ],
  imports: [
    IonicPageModule.forChild(ChamadaPage),
    TranslateModule
  ],
})
export class ChamadaPageModule {}
