import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot as ActiveSnapshot,
  RouterStateSnapshot as RouterSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';

import { NotificationService } from 'src/app/_shared/services';
import { AuthService } from '../services/auth.service';

type canActivateTypes =
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree;

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _notificationSrv: NotificationService,
    private _authService: AuthService,
  ) { }

  canActivate(route: ActiveSnapshot, state: RouterSnapshot): canActivateTypes {
    const accessToken = this._authService.accessToken;
    if (!accessToken) {
      this.redirectUrl(state);
      return false;
    } else {
      return true;
    }
  }

  private redirectUrl(state: RouterSnapshot) {
    this._notificationSrv.warn('Please login first!');
    this._router.navigate(['auth', 'login'], {
      queryParams: { returnUrl: state.url }
    });
  }
}
