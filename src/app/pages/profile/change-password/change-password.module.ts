import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './change-password.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  declarations: [ChangePasswordComponent],
  entryComponents: [ChangePasswordComponent],
  exports: [ChangePasswordComponent]
})
export class ChangePasswordModule { }
