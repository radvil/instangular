import { Action, createReducer, on } from "@ngrx/store";

import { AuthState } from "../interfaces";
import { initialState } from "./auth.state";
import * as AuthActions from './auth.actions';

const reducer = createReducer(
  initialState,

  on(AuthActions.Login, state => ({
    ...state,
    isLoading: true,
    isLoaded: false,
  })),
  on(AuthActions.LoginSuccess, (state, { accessToken }) => ({
    ...state,
    isLoading: false,
    isLoaded: true,
    accessToken,
  })),
  on(AuthActions.LoginFailure, (state, action) => ({
    ...state,
    isLoading: false,
    isLoaded: false,
    error: action.error,
  })),

  on(AuthActions.RegisterUser, state => ({
    ...state,
    isLoading: true,
    isLoaded: false,
  })),
  on(AuthActions.RegisterUserSuccess, (state, { accessToken }) => ({
    ...state,
    isLoading: false,
    isLoaded: true,
    accessToken,
  })),
  on(AuthActions.RegisterUserFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error
  })),

  on(AuthActions.GetAuthUser, state => ({
    ...state,
    isLoading: true
  })),
  on(AuthActions.GetAuthUserSuccess, (state, { user, accessToken }) => ({
    ...state,
    isLoading: false,
    user, accessToken,
    isAuth: true
  })),
  on(AuthActions.GetAuthUserFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),

  on(AuthActions.ChangeProfilePhoto, (state, payload) => {
    const { photo, photoThumb } = payload;
    return {
      ...state,
      user: { ...state.user, photo, photoThumb },
    }
  }),

  on(AuthActions.UpdateProfileBasicsInfo, (state, { dto }) => {
    const { userId, ...changes } = dto;
    return {
      ...state,
      user: { ...state.user, changes },
    }
  }),

  on(AuthActions.Logout, state => ({
    ...state,
    isLoading: false,
    user: null,
  })),
)

export function authReducer(state: AuthState, action: Action) {
  // state is the state of reducer and action is what we change in our state
  return reducer(state, action);
}