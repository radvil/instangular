import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, exhaustMap, map, switchMap, tap, withLatestFrom } from "rxjs/operators";

import { AuthState } from "src/app/auth";
import { ChangeProfilePhoto, UpdateProfileBasicsInfo, UpdateProfileSensitivesInfo } from "src/app/auth/store/auth.actions";
import { $_authUser } from "src/app/auth/store/auth.selectors";
import { PushManyPosts } from "src/app/post/store/post.actions";
import { PostState } from "src/app/post/store/post.state";
import { UserBasicsInfoDto, UserPhotoDto, UserSensitivesInfoDto, UserUpdatePasswordDto } from "../interfaces/user.dto";
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
      const dto = <UserPhotoDto>{
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

  updateUserBasicsInfo$ = createEffect(() => this._actions$.pipe(
    ofType(userActions.UpdateUserBasicsInfo),
    withLatestFrom(this._store.select($_authUser)),
    exhaustMap(([action, user]) => {
      const dto = <UserBasicsInfoDto>{
        userId: user._id,
        ...action.dto
      }
      return this._userService.updateBasicsInfo(dto).pipe(
        map(() => userActions.UpdateUserBasicsInfoSuccess({ dto })),
        tap(({ dto }) => this._store.dispatch(UpdateProfileBasicsInfo({ dto }))),
        catchError(error => of(userActions.UpdateUserBasicsInfoFailure({ error })))
      )
    })
  ))

  updateUserSensitivesInfo$ = createEffect(() => this._actions$.pipe(
    ofType(userActions.UpdateUserSensitivesInfo),
    withLatestFrom(this._store.select($_authUser)),
    exhaustMap(([action, user]) => {
      const dto = <UserSensitivesInfoDto>{
        userId: user._id,
        ...action.dto
      }
      return this._userService.updateSensitivesInfo(dto).pipe(
        map(() => userActions.UpdateUserSensitivesInfoSuccess({ dto })),
        tap(({ dto }) => this._store.dispatch(UpdateProfileSensitivesInfo({ dto }))),
        catchError(error => of(userActions.UpdateUserSensitivesInfoFailure({ error })))
      )
    })
  ))

  updateUserPassword$ = createEffect(() => this._actions$.pipe(
    ofType(userActions.UpdateUserPassword),
    exhaustMap(action => {
      const dto = <UserUpdatePasswordDto>{ ...action.dto };
      return this._userService.updatePassword(dto).pipe(
        map(() => userActions.UpdateUserPasswordSuccess()),
        catchError(error => of(userActions.UpdateUserSensitivesInfoFailure({ error })))
      )
    })
  ))

  constructor(
    private _userService: UserService,
    private _actions$: Actions,
    private _store: Store<PostState | AuthState>,
  ) { }
}