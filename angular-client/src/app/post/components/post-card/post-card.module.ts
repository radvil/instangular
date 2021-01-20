import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ConfirmDialogModule, FormFieldModule, InstAngularPipesModule, MenuActionsModule } from 'src/app/_shared';
import { PostCardComponent } from './post-card.component';
import { PostCardHeaderComponent } from './post-card-header/post-card-header.component';
import { PostCardButtonsComponent } from './post-card-buttons/post-card-buttons.component';
import { PostStoreModule } from '../../store/post-store.module';
import { CommentStoreModule } from 'src/app/comment/store/comment-store.module';
import { PostEditDialogModule } from '../post-edit-dialog/post-edit-dialog.module';


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

    PostStoreModule,
    CommentStoreModule,
    InstAngularPipesModule,

    MenuActionsModule,
    FormFieldModule,
    PostEditDialogModule,
    ConfirmDialogModule,
  ],
  exports: [
    PostCardComponent,
    PostCardHeaderComponent,
    PostCardButtonsComponent,
  ],
})
export class PostCardModule { }
