import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './forgot-password.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  declarations: [ForgotPasswordComponent],
  entryComponents: [ForgotPasswordComponent],
  exports: [ForgotPasswordComponent]
})
export class ForgotPasswordModule { }
