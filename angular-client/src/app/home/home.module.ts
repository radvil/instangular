import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StoryComponent } from './story/story.component';

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
    HomeRoutingModule,

    MatButtonModule,
    MatIconModule,
  ]
})
export class HomeModule { }
