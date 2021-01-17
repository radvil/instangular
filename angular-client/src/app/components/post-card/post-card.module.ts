import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PostCardComponent } from './post-card.component';
import { InstAngularPipesModule } from 'src/app/utils';


@NgModule({
  declarations: [
    PostCardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LazyLoadImageModule,
    MatButtonModule,
    MatIconModule,
    InstAngularPipesModule,
  ],
  exports: [
    PostCardComponent,
  ],
})
export class PostCardModule { }
