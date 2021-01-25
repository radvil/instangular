import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot as ActiveSnapshot,
  RouterStateSnapshot as RouterSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { LocalStorageService, NotificationService } from 'src/app/_shared/services';

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
    private localStorageService: LocalStorageService,
  ) { }

  canActivate(route: ActiveSnapshot, state: RouterSnapshot): canActivateTypes {
    const accessToken = this.localStorageService.getItem('accessToken');
    if (!accessToken) {
      this.redirectUrl(state);
      return false;
    } else {
      return true;
    }
  }

  private redirectUrl(state: RouterSnapshot) {
    this.notificationSrv.warn('Please login first!');
    this.router.navigate(['auth', 'login'], {
      queryParams: { returnUrl: state.url }
    });
  }
}
