import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { CommentRowModule, CommentsListModule } from '../components';
import { CommentDetailComponent } from './comment-detail/comment-detail.component';
import { CommentStoreModule } from '../store/comment-store.module';
import { FormFieldModule, PageHeaderModule, ReactionsDialogModule } from 'src/app/_shared';

const routes: Routes = [
  {
    path: ':commentId',
    component: CommentDetailComponent,
    data: { title: 'Comment Replies' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommentRoutingModule { }

@NgModule({
  declarations: [CommentDetailComponent],
  imports: [
    CommonModule,
    MatSnackBarModule,

    CommentRoutingModule,
    CommentStoreModule,
    CommentsListModule,
    CommentRowModule,
    PageHeaderModule,
    FormFieldModule,
    ReactionsDialogModule,
  ]
})
export class CommentModule { }
