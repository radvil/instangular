import { createReducer, on } from '@ngrx/store';
import { initialUserState, UserState, userAdapter } from './user.state';
import * as UserActions from './user.actions';

export const userReducer = createReducer(
  initialUserState,

  on(UserActions.GetUser, (state: UserState, { username }) => ({
    ...state,
    isLoaded: false,
    isLoading: true,
    selectedUsername: username,
  })),
  on(UserActions.GetUserFailure, (state: UserState, { error }) => ({
    ...state,
    isLoaded: false,
    isLoading: false,
    error,
  })),
  on(UserActions.GetUserSuccess, (state: UserState, { user }) => (
    userAdapter.addOne(user, {
      ...state,
      isLoaded: true,
      loading: false,
    })
  )),

  on(UserActions.UploadUserProfilePicture, (state) => ({
    ...state,
    isLoading: true,
    isLoaded: false,
  })),
  on(UserActions.UploadUserProfilePictureFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    isLoaded: false,
    error,
  })),
  on(UserActions.UploadUserProfilePictureSuccess, (state, { user }) => (
    userAdapter.upsertOne(user, {
      ...state,
      loading: false,
      isLoaded: true,
      selectedUsername: user.username,
    })
  )),
)
