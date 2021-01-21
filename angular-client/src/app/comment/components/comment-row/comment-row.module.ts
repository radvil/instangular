import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { InstAngularPipesModule } from 'src/app/_shared/pipes';
import { CommentRowComponent } from './comment-row.component';


@NgModule({
  declarations: [
    CommentRowComponent,
  ],
  imports: [
    CommonModule,
    LazyLoadImageModule,
    InstAngularPipesModule,
  ],
  exports: [
    CommentRowComponent,
  ],
})
export class CommentRowModule { }
