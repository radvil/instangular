import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { CommentsComponent } from './comments.component';
import { InstAngularPipesModule } from 'src/app/utils';


@NgModule({
  declarations: [
    CommentsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    LazyLoadImageModule,
    InstAngularPipesModule,
  ],
  exports: [CommentsComponent],
})
export class CommentsModule { }
