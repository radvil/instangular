import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { InstAngularPipesModule } from '../_shared/pipes';
import { UserAvatarModule } from '../_shared/components';
import { NotificationsComponent } from './container/notifications.component';
import { FollowRequestComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: NotificationsComponent,
    data: { title: 'Notifications' }
  }
];

@NgModule({
  declarations: [NotificationsComponent, FollowRequestComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    LazyLoadImageModule,
    InstAngularPipesModule,
    UserAvatarModule,
  ],
})
export class NotificationsModule { }
