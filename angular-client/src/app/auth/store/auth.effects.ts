import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { catchError, map, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";

import { LocalStorageService } from "src/app/_shared/services";
import { AuthService } from "../services";
import { AuthState } from "../interfaces";
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {

  login$ = createEffect(() => this._actions$.pipe(
    ofType(AuthActions.Login),
    switchMap(({ loginDto }) => this._authService.login(loginDto).pipe(
      map(accessToken => AuthActions.LoginSuccess({ accessToken })),
      catchError(error => of(AuthActions.LoginFailure({ error })))
    ))
  ))

  afterLoggedIn$ = createEffect(() => this._actions$.pipe(
    ofType(AuthActions.LoginSuccess),
    tap(({ accessToken }) => {
      if (accessToken) {
        this._localStorageService.setItem('accessToken', accessToken);
        this._store.dispatch(AuthActions.GetAuthUser());
        this._router.navigateByUrl('/home');
      }
    })
  ), { dispatch: false });

  getAuthUser$ = createEffect(() => this._actions$.pipe(
    ofType(AuthActions.GetAuthUser),
    map(() => this._localStorageService.getItem('accessToken') as string),
    switchMap(accessToken => {
      return this._authService.requestAuthUser().pipe(
        map((user) => AuthActions.GetAuthUserSuccess({ user, accessToken })),
        catchError(error => of(AuthActions.GetAuthUserFailure({ error })))
      )
    }),
    catchError(_ => {
      return of(AuthActions.GetAuthUserFailure({ error: new Error('No Token!') }))
    }),
  ))

  logout$ = createEffect(() => this._actions$.pipe(
    ofType(AuthActions.Logout),
    tap(() => {
      this._localStorageService.removeItem('accessToken');
      this._router.navigateByUrl('/auth/login');
    })
  ), { dispatch: false })

  constructor(
    private _actions$: Actions,
    private _authService: AuthService,
    private _localStorageService: LocalStorageService,
    private _router: Router,
    private _store: Store<AuthState>,
  ) { }
}