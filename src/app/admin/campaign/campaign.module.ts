import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CampaignPage } from './campaign.page';
import { ModalComponentModule } from './modal/modal.module';
import { CommentModule } from './comment/comment.module';

const routes: Routes = [
  {
    path: '',
    component: CampaignPage
  }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ModalComponentModule,
    CommentModule
  ],
  declarations: [CampaignPage]
})

export class CampaignPageModule {}
