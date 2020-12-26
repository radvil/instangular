import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { HomeComponent } from './home.component';
import { PostItemModule } from '../posts/post-item/post-item.module';
import { StoryComponent } from './story/story.component';
import { PostStoreModule } from '../posts';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Home' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }

@NgModule({
  declarations: [HomeComponent, StoryComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    HomeRoutingModule,
    PostItemModule,
    PostStoreModule,

    MatButtonModule,
    MatIconModule,
  ]
})
export class HomeModule { }