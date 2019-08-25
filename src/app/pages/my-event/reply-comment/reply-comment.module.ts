import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReplyCommentComponent } from './reply-comment.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule],
  declarations: [ReplyCommentComponent],
  entryComponents: [ReplyCommentComponent],
  exports: [ReplyCommentComponent]
})
export class ReplyCommentModule { }
