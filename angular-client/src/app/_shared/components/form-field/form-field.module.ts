import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { FormFieldService } from './form-field.service';
import { FormFieldComponent } from './form-field.component';
import { UserAvatarModule } from '../user-avatar/user-avatar.module';

@NgModule({
  declarations: [FormFieldComponent],
  imports: [
    CommonModule,
    FormsModule,
    LazyLoadImageModule,
    MatButtonModule,
    MatIconModule,
    UserAvatarModule,
  ],
  exports: [FormFieldComponent],
  providers: [FormFieldService],
})
export class FormFieldModule { }
