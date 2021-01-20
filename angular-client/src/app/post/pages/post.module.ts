import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormFieldModule, PageHeaderModule } from 'src/app/_shared/components';
import { CommentStoreModule } from 'src/app/comment/store/comment-store.module';
import { CommentsListModule } from 'src/app/comment/components';

import { PostStoreModule } from '../store/post-store.module';
import { PostCardModule } from '../components';
import { PostRoutingModule } from './post-routing.module';
import { PostDetailComponent } from './post-detail/post-detail.component';


@NgModule({
  declarations: [PostDetailComponent],
  imports: [
    CommonModule,
    PostRoutingModule,
    PostStoreModule,
    CommentStoreModule,
    PostCardModule,
    PageHeaderModule,
    CommentsListModule,
    FormFieldModule,
  ]
})
export class PostModule { }
