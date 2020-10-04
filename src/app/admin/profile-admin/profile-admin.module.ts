import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordAdminModule } from './change-password-admin/change-password-admin.module';
import { IonicModule } from '@ionic/angular';

import { ProfileAdminPage } from './profile-admin.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileAdminPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ChangePasswordAdminModule
  ],
  declarations: [ProfileAdminPage]
})
export class ProfileAdminPageModule {}
