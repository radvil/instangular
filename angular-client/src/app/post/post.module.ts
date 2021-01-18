import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommentsModule, PageHeaderModule, PostCardModule } from '../components';
import { PostRoutingModule } from './post-routing.module';
import { PostStoreModule } from './store/post-store.module';
import { PostCommentsComponent } from './post-comments/post-comments.component';
import { CommentStoreModule } from '../comment';
import { CommentRepliesComponent } from './comment-replies/comment-replies.component';


@NgModule({
  declarations: [PostCommentsComponent, CommentRepliesComponent],
  imports: [
    CommonModule,
    PostRoutingModule,
    PostStoreModule,
    CommentStoreModule,
    PostCardModule,
    PageHeaderModule,
    CommentsModule,
  ]
})
export class PostModule { }
