import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { InstAngularPipesModule } from 'src/app/utils';
import { MenuActionsModule } from '../menu-actions/menu-actions.module';
import { PostCardComponent } from './post-card.component';


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
    MatDialogModule,
    MatSnackBarModule,
    InstAngularPipesModule,
    MenuActionsModule,
  ],
  exports: [
    PostCardComponent,
  ],
})
export class PostCardModule { }
