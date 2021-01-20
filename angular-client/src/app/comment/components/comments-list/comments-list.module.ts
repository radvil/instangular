import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommentsListComponent } from './comments-list.component';
import { CommentRowModule } from '../comment-row/comment-row.module';
import { RepliesPreviewModule } from '../replies-preview/replies-preview.module';

@NgModule({
  declarations: [
    CommentsListComponent,
  ],
  imports: [
    CommonModule,
    CommentRowModule,
    RepliesPreviewModule,
  ],
  exports: [
    CommentsListComponent,
  ],
})
export class CommentsListModule { }
