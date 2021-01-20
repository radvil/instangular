import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadProfilePictureComponent } from './upload-profile-picture.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageHeaderModule } from '../page-header/page-header.module';
import { UserStoreModule } from 'src/app/user/store/user-store.module';


@NgModule({
  declarations: [UploadProfilePictureComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PageHeaderModule,
    UserStoreModule,
  ],
  exports: [UploadProfilePictureComponent],
})
export class UploadProfilePictureModule { }
