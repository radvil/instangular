import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageHeaderModule } from '../components';
import { PostRoutingModule } from './post-routing.module';
import { PostStoreModule } from './store/post-store.module';
import { PostCommentsComponent } from './post-comments/post-comments.component';
import { CommentStoreModule } from '../comment';
import { PostItemModule } from './post-item/post-item.module';


@NgModule({
  declarations: [PostCommentsComponent],
  imports: [
    CommonModule,
    PostRoutingModule,
    PostStoreModule,
    CommentStoreModule,
    PostItemModule,
    PageHeaderModule,
  ]
})
export class PostModule { }
