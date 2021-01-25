import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
// 3rd parties
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// local modules
import { PageHeaderModule } from 'src/app/_shared/components';
import { UserStoreModule } from '../store/user-store.module';
import { PostStoreModule } from 'src/app/post/store/post-store.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserEditComponent } from './user-edit/user-edit.component';

const routes: Routes = [
  {
    path: ':username',
    component: UserProfileComponent,
    data: { title: 'User Profile' }
  },
  {
    path: ':username/edit',
    component: UserEditComponent,
    data: { title: 'Edit Profile' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

@NgModule({
  declarations: [UserProfileComponent, UserEditComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    // 3rd parties
    LazyLoadImageModule,
    FontAwesomeModule,
    MatButtonModule,
    MatIconModule,
    // local modules
    UserRoutingModule,
    UserStoreModule,
    PostStoreModule,
    PageHeaderModule,
  ],
})
export class UserModule { }
