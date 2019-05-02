import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlunoPage } from './aluno';

@NgModule({
  declarations: [
    AlunoPage,
  ],
  imports: [
    IonicPageModule.forChild(AlunoPage),
  ],
})
export class AlunoPageModule {}
