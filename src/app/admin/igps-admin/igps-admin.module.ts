import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { IgpsAdminPage } from './igps-admin.page';
import { SharedModule } from 'src/app/shared/shared.module';


const routes: Routes = [
  {
    path: '',
    component: IgpsAdminPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [IgpsAdminPage]
})
export class IgpsAdminPageModule {}
