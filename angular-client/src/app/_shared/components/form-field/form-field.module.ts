import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FormFieldComponent } from './form-field.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CommentStoreModule } from 'src/app/comment/store';


@NgModule({
  declarations: [FormFieldComponent],
  imports: [
    CommonModule,
    FormsModule,
    LazyLoadImageModule,
    CommentStoreModule,
  ],
  exports: [FormFieldComponent]
})
export class FormFieldModule { }
