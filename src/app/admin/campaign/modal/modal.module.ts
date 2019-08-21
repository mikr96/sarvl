import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { IonicModule } from '@ionic/angular';

import { ModalComponent } from './modal.component';


@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [ModalComponent],
  entryComponents: [ModalComponent],
  exports: [ModalComponent]
})
export class ModalComponentModule {}
