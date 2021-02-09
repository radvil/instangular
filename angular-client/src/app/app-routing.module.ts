import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/pages/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    loadChildren: () => import('./user/pages/user.module').then(m => m.UserModule)
  },
  {
    path: 'post',
    canActivate: [AuthGuard],
    loadChildren: () => import('./post/pages/post.module').then(m => m.PostModule)
  },
  {
    path: 'comment',
    canActivate: [AuthGuard],
    loadChildren: () => import('./comment/pages/comment.module').then(m => m.CommentModule)
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () => import('./home/pages/home.module').then(m => m.HomeModule),
  },
  {
    path: 'account',
    canActivate: [AuthGuard],
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
