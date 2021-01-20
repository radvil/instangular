import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { InstAngularPipesModule } from 'src/app/_shared';
import { PostEditDialogComponent } from './post-edit-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [PostEditDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    InstAngularPipesModule,
  ]
})
export class PostEditDialogModule { }
