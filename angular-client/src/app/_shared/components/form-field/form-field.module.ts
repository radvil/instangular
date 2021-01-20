import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FormFieldComponent } from './form-field.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [FormFieldComponent],
  imports: [
    CommonModule,
    FormsModule,
    LazyLoadImageModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [FormFieldComponent]
})
export class FormFieldModule { }
