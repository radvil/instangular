import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { InstAngularPipesModule } from 'src/app/_shared/pipes';
import { CommentRowComponent } from './comment-row.component';
import { UserAvatarModule } from 'src/app/_shared';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    CommentRowComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    LazyLoadImageModule,
    InstAngularPipesModule,
    UserAvatarModule,
  ],
  exports: [
    CommentRowComponent,
  ],
})
export class CommentRowModule { }
