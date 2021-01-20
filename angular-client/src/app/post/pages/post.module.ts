import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { CommentsListModule } from 'src/app/comment/components';
import { CommentStoreModule } from 'src/app/comment/store/comment-store.module';
import { FormFieldModule, LoadingDialogModule, PageHeaderModule } from 'src/app/_shared/components';
import { PostCardModule } from '../components';
import { PostStoreModule } from '../store/post-store.module';
import { PostAddComponent } from './post-add/post-add.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostRoutingModule } from './post-routing.module';


@NgModule({
  declarations: [PostDetailComponent, PostAddComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,

    PostRoutingModule,
    PostStoreModule,
    CommentStoreModule,
    PostCardModule,
    PageHeaderModule,
    CommentsListModule,
    FormFieldModule,
    LoadingDialogModule,
  ]
})
export class PostModule { }
