import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadaPage } from './chamada';

@NgModule({
  declarations: [
    ChamadaPage,
  ],
  imports: [
    IonicPageModule.forChild(ChamadaPage),
  ],
})
export class ChamadaPageModule {}
