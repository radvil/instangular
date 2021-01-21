import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UploadProfilePictureComponent } from './upload-profile-picture.component';
import { UserStoreModule } from 'src/app/user/store/user-store.module';


@NgModule({
  declarations: [UploadProfilePictureComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    UserStoreModule,
  ],
  exports: [UploadProfilePictureComponent],
})
export class UploadProfilePictureModule { }
