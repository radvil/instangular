import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { InstAngularPipesModule } from 'src/app/_shared';
import { RepliesPreviewComponent } from './replies-preview.component';


@NgModule({
  declarations: [
    RepliesPreviewComponent,
  ],
  imports: [
    CommonModule,
    LazyLoadImageModule,
    InstAngularPipesModule,
  ],
  exports: [
    RepliesPreviewComponent
  ],
})
export class RepliesPreviewModule { }
