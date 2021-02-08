import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AuthService } from 'src/app/auth/services';
import { AuthState } from 'src/app/auth/interfaces';
import { Logout } from 'src/app/auth/store/auth.actions';


@Injectable() export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing: boolean;
  private tokenSubject: BehaviorSubject<string>;

  constructor(
    private _authSrv: AuthService,
    private _store: Store<AuthState>,
  ) {
    this.tokenSubject = this._authSrv.accessTokenSubject;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the Authorization header to outgoing request as option (status 204)
    request = this.setAuthHeader(request, this.tokenSubject.value);
    // Token expired with status 401
    // http.refreshToken() pipe return user response then set token to LS
    // Retry failed request and pipe store.getCurrentUser()
    return next.handle(request).pipe(
      catchError((err) => {
        // if expired
        if (err instanceof HttpErrorResponse && err.status == 401) {
          if (this.tokenSubject.value) {
            return this.refreshToken(request, next);
          }
        }
        // if 403 (refresh token req unauthorized)
        else if (err instanceof HttpErrorResponse && err.status == 403) {
          this._store.dispatch(Logout());
        }
        else {
          // if other error status code
          return throwError(err);
        }
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

      return this._authSrv.refreshToken().pipe(
        switchMap((newAccessToken) => {
          this.isRefreshing = false;
          // repeat failed request with new token
          return next.handle(this.setAuthHeader(req, newAccessToken))
        })
      );
    } else {
      // wait whilst getting new token
      this.tokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(this.setAuthHeader(req, token)))
      );
    }
  } // EOL refreshToken()

}
