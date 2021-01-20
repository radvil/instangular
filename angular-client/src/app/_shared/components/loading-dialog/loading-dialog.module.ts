import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoadingDialogComponent } from './loading-dialog.component';

@NgModule({
  declarations: [LoadingDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class LoadingDialogModule {}
