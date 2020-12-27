import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { LocalStorageService } from '../services';
import { AuthService } from '../auth/auth.service';
import { AuthState } from '../auth/store/auth.model';
import { Store } from '@ngrx/store';
import { Logout } from '../auth/store/auth.actions';


@Injectable() export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing: boolean;
  private tokenSubject = new BehaviorSubject<string>(null);

  constructor(
    private localStorageSrv: LocalStorageService,
    private authSrv: AuthService,
    private store: Store<AuthState>,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the Authorization header to outgoing request as option (status 204)
    request = this.setAuthHeader(request, this.token);
    // Token expired with status 401
    // http.refreshToken() pipe return user response then set token to LS
    // Retry failed request and pipe store.getCurrentUser()
    return next.handle(request).pipe(
      catchError((err) => {
        // if expired
        if (err instanceof HttpErrorResponse && err.status === 401) {
          if (!!this.token) return this.refreshToken(request, next);
        }
        // if 403 (refresh token req unauthorized)
        if (err instanceof HttpErrorResponse && err.status === 403) {
          this.store.dispatch(Logout());
        }
        // if other error status code
        return throwError(err);
      })
    );
  }

  private setAuthHeader(req: HttpRequest<any>, __token: string) {
    if (__token) {
      return req.clone({ setHeaders: { Authorization: __token } })
    }
    return req;
  }

  private refreshToken(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      // Start refreshing token...
      this.isRefreshing = true;
      this.tokenSubject.next(null);

      return this.authSrv.refreshToken().pipe(
        switchMap((newAccessToken) => {
          this.isRefreshing = false;
          this.tokenSubject.next(newAccessToken);
          // repeat failed request with new token
          return next.handle(this.setAuthHeader(req, newAccessToken))
        })
      );
    } else {
      // wait whilst getting new token
      return this.tokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => next.handle(this.setAuthHeader(req, token)))
      );
    }
  } // EOL refreshToken()

  // localStorage token getter
  get token() {
    return this.localStorageSrv.getItem('accessToken');
  }

}
