import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PostItemComponent } from './post-item.component';
import { PostItemFooterComponent } from './post-item-footer/post-item-footer.component';


@NgModule({
  declarations: [PostItemComponent, PostItemFooterComponent],
  imports: [
    CommonModule,
    RouterModule,
    LazyLoadImageModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [PostItemComponent, PostItemFooterComponent],
})
export class PostItemModule { }
