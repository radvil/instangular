import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageHeaderModule } from 'src/app/_shared/components';
import { CommentStoreModule } from 'src/app/comment/store';
import { CommentsListModule } from 'src/app/comment/components';

import { PostStoreModule } from '../store';
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
  ]
})
export class PostModule { }
