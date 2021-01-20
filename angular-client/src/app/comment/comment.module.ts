import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommentRoutingModule } from './comment-routing.module';
import { CommentDetailComponent } from './comment-detail/comment-detail.component';
import { CommentStoreModule } from './comment-store.module';

@NgModule({
  declarations: [CommentDetailComponent],
  imports: [
    CommonModule,
    CommentRoutingModule,
    CommentStoreModule,
  ]
})
export class CommentModule { }
