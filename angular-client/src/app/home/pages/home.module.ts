import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PageHeaderModule } from 'src/app/_shared';
import { PostCardModule } from 'src/app/post/components';
import { PostStoreModule } from 'src/app/post/store/post-store.module'
import { StoryComponent } from '../components';
import { HomeComponent } from './home.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Home' },
  }
];

@NgModule({
  declarations: [HomeComponent, StoryComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,

    PostCardModule,
    PostStoreModule,
    PageHeaderModule,
  ]
})
export class HomeModule { }
