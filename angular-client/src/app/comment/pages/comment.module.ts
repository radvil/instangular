import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { CommentDetailComponent } from './comment-detail/comment-detail.component';
import { CommentStoreModule } from '../store/comment-store.module';

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
    CommentRoutingModule,
    CommentStoreModule,
  ]
})
export class CommentModule { }
