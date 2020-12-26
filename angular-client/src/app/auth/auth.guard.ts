import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot as ActiveSnapshot,
  RouterStateSnapshot as RouterSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { $_isAuth } from './store/auth.selectors';
import { NotificationService } from 'src/app/services';

type canActivateTypes =
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree;

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private notificationSrv: NotificationService,
    private store: Store
  ) { }

  canActivate(route: ActiveSnapshot, state: RouterSnapshot): canActivateTypes {
    return this.store.select($_isAuth).pipe(
      filter(isAuth => isAuth = true),
      tap(isAuth => !isAuth && this.redirectUrl(state))
    );
  }

  private redirectUrl(state: RouterSnapshot) {
    this.notificationSrv.warn('Please login first!');
    this.router.navigate(['auth', 'login'], {
      queryParams: { returnUrl: state.url }
    });
  }
}
