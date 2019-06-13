import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlunoPage } from './aluno';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AlunoPage,
  ],
  imports: [
    IonicPageModule.forChild(AlunoPage),
    ComponentsModule
  ],
})
export class AlunoPageModule {}
