import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PostCardComponent } from './post-card.component';
import { PostCardFooterComponent } from './post-card-footer/post-card-footer.component';


@NgModule({
  declarations: [PostCardComponent, PostCardFooterComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LazyLoadImageModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [PostCardComponent, PostCardFooterComponent],
})
export class PostCardModule { }
