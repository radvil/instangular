import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostCommentsComponent } from './post-comments/post-comments.component';

const routes: Routes = [
  {
    path: ':postId',
    component: PostCommentsComponent,
    data: { title: 'Post Comments' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostRoutingModule { }
