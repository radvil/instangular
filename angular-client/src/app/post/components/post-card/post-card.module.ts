import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { InstAngularPipesModule, MenuActionsModule } from 'src/app/_shared';
import { PostCardComponent } from './post-card.component';
import { PostCardHeaderComponent } from './post-card-header/post-card-header.component';
import { PostCardButtonsComponent } from './post-card-buttons/post-card-buttons.component';


@NgModule({
  declarations: [
    PostCardComponent,
    PostCardHeaderComponent,
    PostCardButtonsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LazyLoadImageModule,
    MatButtonModule,
    MatIconModule,
    InstAngularPipesModule,
    MenuActionsModule,
  ],
  exports: [
    PostCardComponent,
    PostCardHeaderComponent,
    PostCardButtonsComponent,
  ],
})
export class PostCardModule { }
