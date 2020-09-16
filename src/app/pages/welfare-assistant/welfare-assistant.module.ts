import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WelfareAssistantPage } from './welfare-assistant.page';

const routes: Routes = [
  {
    path: '',
    component: WelfareAssistantPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WelfareAssistantPage]
})
export class WelfareAssistantPageModule {}
