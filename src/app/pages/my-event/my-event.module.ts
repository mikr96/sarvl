import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MyEventPage } from './my-event.page';
import { CommentComponentModule } from './comment/comment.module';

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
    CommentComponentModule
  ],
  declarations: [MyEventPage]
})
export class MyEventPageModule {}
