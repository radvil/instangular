import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAvatarComponent } from './user-avatar.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';


@NgModule({
  declarations: [UserAvatarComponent],
  imports: [
    CommonModule,
    LazyLoadImageModule,
  ],
  exports: [UserAvatarComponent],
})
export class UserAvatarModule { }
