import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LembrarSenhaPage } from './lembrar-senha';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LembrarSenhaPage,
  ],
  imports: [
    IonicPageModule.forChild(LembrarSenhaPage),
    TranslateModule
  ],
})
export class LembrarSenhaPageModule {}
