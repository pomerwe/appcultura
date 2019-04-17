import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinanceiroPage } from './financeiro';


@NgModule({
  declarations: [
    FinanceiroPage
  ],
  imports: [
    IonicPageModule.forChild(FinanceiroPage),
    
  ],
})
export class FinanceiroPageModule {}
