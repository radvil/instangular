import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { UploadProfilePictureModule, PageHeaderModule } from 'src/app/_shared/components';
import { InitProfileImageComponent } from './init-profile-image/init-profile-image.component';
import { InitProfileInfoComponent } from './init-profile-info/init-profile-info.component';
import { UserStoreModule } from 'src/app/user/store/user-store.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'setup-profile-photo',
    pathMatch: 'full'
  },
  {
    path: 'setup-profile-photo',
    component: InitProfileImageComponent,
    data: { title: 'Upload User Photo' }
  },
  {
    path: 'setup-basics-info',
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
    MatButtonModule,
    PostRegisteredRoutingModule,
    PageHeaderModule,
    UploadProfilePictureModule,
    UserStoreModule,
  ]
})
export class PostRegisteredModule { }
