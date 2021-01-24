import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { InstAngularPipesModule } from 'src/app/_shared';
import { CommentRowComponent } from './comment-row.component';
import { RepliesPreviewComponent } from './replies-preview/replies-preview.component';


@NgModule({
  declarations: [
    CommentRowComponent,
    RepliesPreviewComponent,
  ],
  imports: [
    CommonModule,
    LazyLoadImageModule,
    InstAngularPipesModule,
  ],
  exports: [
    CommentRowComponent,
    RepliesPreviewComponent
  ],
})
export class CommentRowModule { }
