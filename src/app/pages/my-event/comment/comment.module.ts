import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [CommentComponent],
  entryComponents: [CommentComponent],
  exports: [CommentComponent]
})

export class CommentComponentModule { }
