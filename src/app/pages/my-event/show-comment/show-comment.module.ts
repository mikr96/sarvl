import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ShowCommentComponent } from './show-comment.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [ShowCommentComponent],
  entryComponents: [ShowCommentComponent],
  exports: [ShowCommentComponent]
})
export class ShowCommentModule { }
