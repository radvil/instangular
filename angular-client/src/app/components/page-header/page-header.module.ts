import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PageHeaderComponent } from './page-header.component';

@NgModule({
  declarations: [PageHeaderComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [PageHeaderComponent],
})
export class PageHeaderModule { }
