import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { CommentsComponent } from './comments.component';
import { InstAngularPipesModule } from 'src/app/utils';
import { CommentComponent } from './comment/comment.component';
import { RepliesPreviewComponent } from './replies-preview/replies-preview.component';
import { FormFieldModule } from '../form-field/form-field.module';


@NgModule({
  declarations: [
    CommentsComponent,
    CommentComponent,
    RepliesPreviewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    LazyLoadImageModule,
    InstAngularPipesModule,
    FormFieldModule,
  ],
  exports: [
    CommentsComponent,
    CommentComponent,
    RepliesPreviewComponent
  ],
})
export class CommentsModule { }
