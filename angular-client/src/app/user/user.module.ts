import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserRoutingModule } from './user-routing.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { TruncatePipe } from '../utils';


@NgModule({
  declarations: [UserProfileComponent, UserEditComponent, TruncatePipe],
  imports: [
    CommonModule,
    HttpClientModule,
    LazyLoadImageModule,
    FontAwesomeModule,
    MatButtonModule,
    MatIconModule,
    UserRoutingModule,
  ],
  providers: [TruncatePipe],
})
export class UserModule { }
