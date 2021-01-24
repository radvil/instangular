import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormFieldModule } from 'src/app/_shared';
import { CommentsListComponent } from './comments-list.component';
import { CommentRowModule } from '../comment-row/comment-row.module';
import { RepliesPreviewModule } from '../replies-preview/replies-preview.module';

@NgModule({
  declarations: [
    CommentsListComponent,
  ],
  imports: [
    CommonModule,
    FormFieldModule,
    CommentRowModule,
    RepliesPreviewModule,
  ],
  exports: [
    CommentsListComponent,
  ],
})
export class CommentsListModule { }
