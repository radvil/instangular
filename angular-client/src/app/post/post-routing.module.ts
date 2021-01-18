import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommentRepliesComponent } from './comment-replies/comment-replies.component';
import { PostCommentsComponent } from './post-comments/post-comments.component';

const routes: Routes = [
  {
    path: ':postId',
    component: PostCommentsComponent,
    data: { title: 'Post Comments' },
  },
  {
    path: 'comment/:commentId',
    component: CommentRepliesComponent,
    data: { title: 'Comment Replies' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostRoutingModule { }
