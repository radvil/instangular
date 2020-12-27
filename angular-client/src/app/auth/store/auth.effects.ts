import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { LocalStorageService } from "../../services/local-storage.service";
import * as AuthActions from './auth.actions';
import { AuthService } from "../auth.service";
import { Store } from "@ngrx/store";
import { AuthState } from "./auth.model";
import { $_isAuth } from "./auth.selectors";

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
    withLatestFrom(this._store.select($_isAuth)),
    tap(([{ accessToken }, isAuth]) => {
      if (isAuth) {
        this._store.dispatch(AuthActions.GetAuthUser());
        this._localStorageService.setItem('accessToken', accessToken);
        this._router.navigateByUrl('/home');
      }
    })
  ), { dispatch: false });

  getAuthUser$ = createEffect(() => this._actions$.pipe(
    ofType(AuthActions.GetAuthUser),
    switchMap(_ => {
      const accessToken = this._localStorageService.getItem('accessToken');
      if (!accessToken) {
        return of(AuthActions.GetAuthUserFailure({ error: new Error('No access token!') }))
      }
      return this._authService.requestAuthUser().pipe(
        map((user) => AuthActions.GetAuthUserSuccess({ user, accessToken })),
        catchError(error => of(AuthActions.GetAuthUserFailure({ error })))
      )
    })
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