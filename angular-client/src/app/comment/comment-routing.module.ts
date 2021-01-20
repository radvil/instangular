import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommentDetailComponent } from './comment-detail/comment-detail.component';

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
