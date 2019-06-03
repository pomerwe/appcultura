import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinanceiroPage } from './financeiro';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    FinanceiroPage
  ],
  imports: [
    IonicPageModule.forChild(FinanceiroPage),
    TranslateModule
  ],
})
export class FinanceiroPageModule {}
