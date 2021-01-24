import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormFieldModule } from 'src/app/_shared';
import { CommentsListComponent } from './comments-list.component';
import { CommentRowModule } from '../comment-row/comment-row.module';

@NgModule({
  declarations: [
    CommentsListComponent,
  ],
  imports: [
    CommonModule,
    FormFieldModule,
    CommentRowModule,
  ],
  exports: [
    CommentsListComponent,
  ],
})
export class CommentsListModule { }
