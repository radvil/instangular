import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { UserStoreModule } from 'src/app/user/store/user-store.module';
import { EditBasicsProfileComponent } from './edit-basics-profile.component';


@NgModule({
  declarations: [EditBasicsProfileComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    UserStoreModule,
  ],
  exports: [EditBasicsProfileComponent],
})
export class EditBasicsProfileModule { }
