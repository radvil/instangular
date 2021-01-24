import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { Post } from "src/app/post";
import { PushManyPosts } from "src/app/post/store/post.actions";
import { UserService } from "../services/user.service";
import * as userActions from './user.actions';


@Injectable()
export class UserEffects {

  getUserByUsername$ = createEffect(() => this._actions$.pipe(
    ofType(userActions.GetUser),
    switchMap(({ username }) => this._userService.getUserByUsername(username).pipe(
      map(({ posts, ...user }) => {
        this._store.dispatch(PushManyPosts({ posts }));
        return userActions.GetUserSuccess({ user })
      }),
      catchError((error) => of(userActions.GetUserFailure({ error })))
    ))
  ))

  constructor(
    private _userService: UserService,
    private _actions$: Actions,
    private _store: Store<Post>,
  ) { }
}