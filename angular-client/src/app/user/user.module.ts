import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
// 3rd parties
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// local modules
import { UserRoutingModule } from './user-routing.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { TruncatePipe } from '../utils';
import { PostStoreModule } from '../post';
import { UserStoreModule } from './store/user-store.module';


@NgModule({
  declarations: [UserProfileComponent, UserEditComponent, TruncatePipe],
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
  ],
  providers: [TruncatePipe],
})
export class UserModule { }
