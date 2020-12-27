import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

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
