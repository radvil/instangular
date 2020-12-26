import { createReducer, on } from '@ngrx/store';
import { initialUserState, UserState, userAdapter } from './user.state';
import * as UserActions from './user.actions';

export const userReducer = createReducer(
  initialUserState,

  on(UserActions.GetUser, (state: UserState, { username }) => ({
    ...state,
    loaded: false,
    loading: true,
    selectedUsername: username,
  })),
  on(UserActions.GetUserFailure, (state: UserState, { error }) => ({
    ...state,
    loaded: false,
    loading: false,
    error,
  })),
  on(UserActions.GetUserSuccess, (state: UserState, { user }) => (
    userAdapter.addOne(user, {
      ...state,
      loaded: true,
      loading: false,
    })
  )),
)
