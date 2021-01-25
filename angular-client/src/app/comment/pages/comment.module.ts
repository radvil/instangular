import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { CommentRowModule, CommentsListModule } from '../components';
import { CommentDetailComponent } from './comment-detail/comment-detail.component';
import { CommentStoreModule } from '../store/comment-store.module';
import { PageHeaderModule } from 'src/app/_shared';
import { PostStoreModule } from 'src/app/post/store/post-store.module';

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
    CommentsListModule,
    CommentRowModule,
    PageHeaderModule,
  ]
})
export class CommentModule { }
