import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PostItemComponent } from './post-item.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [PostItemComponent],
  imports: [
    CommonModule,
    RouterModule,
    LazyLoadImageModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [PostItemComponent],
})
export class PostItemModule { }
