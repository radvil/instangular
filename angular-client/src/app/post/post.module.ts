import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommentsModule, PageHeaderModule, PostCardModule } from '../components';
import { PostRoutingModule } from './post-routing.module';
import { PostStoreModule } from './store/post-store.module';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { CommentStoreModule } from '../comment';


@NgModule({
  declarations: [PostDetailComponent],
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
