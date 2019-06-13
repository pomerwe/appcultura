import { NgModule } from '@angular/core';
import { CommunicationComponent } from './communication/communication';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';
@NgModule({
	declarations: [CommunicationComponent],
	imports: [
		TranslateModule,
		IonicModule
	],
	exports: [CommunicationComponent]
})
export class ComponentsModule {}
