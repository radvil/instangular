import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';

import { ConfirmDialogModule, ReactionsDialogModule } from 'src/app/_shared/components';
import { CommentStoreModule } from '../../store/comment-store.module';
import { CommentRowModule } from '../comment-row/comment-row.module';
import { RepliesPreviewModule } from '../replies-preview/replies-preview.module';
import { CommentsListComponent } from './comments-list.component';


@NgModule({
  declarations: [
    CommentsListComponent,
  ],
  imports: [
    CommonModule,
    CommentRowModule,
    RepliesPreviewModule,
    CommentStoreModule,
    ReactionsDialogModule,
    MatMenuModule,
    ConfirmDialogModule,
  ],
  exports: [
    CommentsListComponent,
  ],
})
export class CommentsListModule { }
