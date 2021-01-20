import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { CommentDialogComponent } from './comment-dialog.component';
import { UserAvatarModule } from '../user-avatar/user-avatar.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [CommentDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    UserAvatarModule,
  ]
})
export class CommentDialogModule { }
