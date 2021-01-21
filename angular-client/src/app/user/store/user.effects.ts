import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap, tap, withLatestFrom } from "rxjs/operators";

import { AuthState } from "src/app/auth";
import { ChangeProfilePhoto } from "src/app/auth/store/auth.actions";
import { $_authUser } from "src/app/auth/store/auth.selectors";
import { PushManyPosts } from "src/app/post/store/post.actions";
import { PostState } from "src/app/post/store/post.state";
import { UploadUserPhotoDto } from "..";
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

  uploadUserProfilePicture$ = createEffect(() => this._actions$.pipe(
    ofType(userActions.UploadUserProfilePicture),
    withLatestFrom(this._store.select($_authUser)),
    switchMap(([action, user]) => {
      const dto = <UploadUserPhotoDto>{
        userId: user._id,
        photo: action.photo,
      }
      return this._userService.uploadProfilePicture(dto).pipe(
        map(data => userActions.UploadUserProfilePictureSuccess({ user: data })),
        tap(({ user }) => {
          const { photo, photoThumb } = user;
          if (photo && photoThumb) {
            this._store.dispatch(ChangeProfilePhoto({ photo, photoThumb }));
          }
        }),
        catchError(error => of(userActions.UploadUserProfilePictureFailure({ error })))
      )
    })
  ))

  constructor(
    private _userService: UserService,
    private _actions$: Actions,
    private _store: Store<PostState | AuthState>,
  ) { }
}