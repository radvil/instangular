import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostRoutingModule } from './post-routing.module';
import { PostStoreModule } from './store/post-store.module';
import { PostCommentsComponent } from './post-comments/post-comments.component';
import { CommentStoreModule } from '../comment';


@NgModule({
  declarations: [PostCommentsComponent],
  imports: [
    CommonModule,
    PostRoutingModule,
    PostStoreModule,
    CommentStoreModule,
  ]
})
export class PostModule { }
