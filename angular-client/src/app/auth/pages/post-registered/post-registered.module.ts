import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { InitProfileImageComponent } from './init-profile-image/init-profile-image.component';
import { InitProfileInfoComponent } from './init-profile-info/init-profile-info.component';
import { UploadProfilePictureModule } from 'src/app/_shared';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'upload-photo',
    pathMatch: 'full'
  },
  {
    path: 'upload-photo',
    component: InitProfileImageComponent,
    data: { title: 'Upload User Photo' }
  },
  {
    path: 'add-basic-info',
    component: InitProfileInfoComponent,
    data: { title: 'Add Basic Info' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostRegisteredRoutingModule { }

@NgModule({
  declarations: [InitProfileImageComponent, InitProfileInfoComponent],
  imports: [
    CommonModule,
    PostRegisteredRoutingModule,
    UploadProfilePictureModule,
  ]
})
export class PostRegisteredModule { }
