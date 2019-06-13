import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TurmasPage } from './turmas';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    TurmasPage,
  ],
  imports: [
    IonicPageModule.forChild(TurmasPage),
    TranslateModule,
    ComponentsModule
  ],
})
export class TurmasPageModule {}
