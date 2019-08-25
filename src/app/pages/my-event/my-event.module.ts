import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MyEventPage } from './my-event.page';
import { CommentComponentModule } from './comment/comment.module';
import { ReplyCommentModule } from './reply-comment/reply-comment.module';
import { ShowCommentModule } from './show-comment/show-comment.module';

const routes: Routes = [
  {
    path: '',
    component: MyEventPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CommentComponentModule,
    ReplyCommentModule,
    ShowCommentModule
  ],
  declarations: [MyEventPage]
})
export class MyEventPageModule {}
