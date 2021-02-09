import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ConfirmDialogModule, PageHeaderModule } from '../_shared/components';
import { UserStoreModule } from '../user/store/user-store.module';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AccountUpdateInfoComponent } from './account-update-info/account-update-info.component';
import { AccountUpdatePasswordComponent } from './account-update-password/account-update-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'settings',
    pathMatch: 'full',
  },
  {
    path: 'settings',
    component: AccountSettingsComponent,
    data: { title: "Account's Settings" },
  },
];

@NgModule({
  declarations: [
    AccountSettingsComponent,
    AccountUpdateInfoComponent,
    AccountUpdatePasswordComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,

    UserStoreModule,
    PageHeaderModule,
    ConfirmDialogModule,
  ],
})
export class AccountModule {}
