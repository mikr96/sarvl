import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordAdminComponent } from './change-password-admin.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  declarations: [ChangePasswordAdminComponent],
  entryComponents: [ChangePasswordAdminComponent],
  exports: [ChangePasswordAdminComponent]
})
export class ChangePasswordAdminModule { }
