import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";

import { LocalStorageService, NotificationService } from "src/app/_shared/services";
import { AuthService } from "../services";
import { AuthState } from "../interfaces";
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {

  registerUser$ = createEffect(() => this._actions$.pipe(
    ofType(AuthActions.RegisterUser),
    switchMap(({ dto }) => this._authService.register(dto).pipe(
      tap(accessToken => {
        if (accessToken) {
          this._store.dispatch(AuthActions.GetAuthUser());
          this._router.navigateByUrl('/auth/post-registered');
        }
      }),
      map(() => AuthActions.RegisterUserSuccess()),
      catchError(error => of(AuthActions.RegisterUserFailure({ error })))
    ))
  ))

  login$ = createEffect(() => this._actions$.pipe(
    ofType(AuthActions.Login),
    switchMap(({ loginDto }) => this._authService.login(loginDto).pipe(
      tap(accessToken => {
        if (accessToken) {
          this._store.dispatch(AuthActions.GetAuthUser());
          this._router.navigateByUrl('/home');
        }
      }),
      map(() => AuthActions.LoginSuccess()),
      catchError(error => of(AuthActions.LoginFailure({ error })))
    ))
  ))

  getAuthUser$ = createEffect(() => this._actions$.pipe(
    ofType(AuthActions.GetAuthUser),
    switchMap(() => {
      if (!this._authService.accessToken) {
        return of(AuthActions.GetAuthUserFailure({ error: new Error('No Token!') }))
      }
      return this._authService.requestAuthUser().pipe(
        map((user) => AuthActions.GetAuthUserSuccess({ user })),
        catchError(error => of(AuthActions.GetAuthUserFailure({ error })))
      )
    })
  ))

  logout$ = createEffect(() => this._actions$.pipe(
    ofType(AuthActions.Logout),
    tap(() => {
      if (this._authService.accessToken) {
        this._localStorageService.removeItem('accessToken');
        this._authService.accessTokenSubject.next(null);
        this._router.navigateByUrl('/auth/login');
        this._notificationService.warn('You are logged out');
      }
    })
  ), { dispatch: false })

  constructor(
    private _actions$: Actions,
    private _authService: AuthService,
    private _notificationService: NotificationService,
    private _localStorageService: LocalStorageService,
    private _router: Router,
    private _store: Store<AuthState>,
  ) { }
}