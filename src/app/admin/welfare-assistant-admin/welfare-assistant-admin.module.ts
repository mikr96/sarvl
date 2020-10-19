import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WelfareAssistantAdminPage } from './welfare-assistant-admin.page';

const routes: Routes = [
  {
    path: '',
    component: WelfareAssistantAdminPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WelfareAssistantAdminPage]
})
export class WelfareAssistantAdminPageModule {}
