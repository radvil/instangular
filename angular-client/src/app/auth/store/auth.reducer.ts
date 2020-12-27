import { Action, createReducer, on } from "@ngrx/store";
import { AuthState } from "./auth.model";
import * as AuthActions from './auth.actions';

export const initialState: AuthState = {
  isLoading: false,
  isAuth: false,
  accessToken: null,
  user: null,
  error: null,
}

const reducer = createReducer(
  initialState,

  on(AuthActions.Login, state => ({ ...state, isLoading: true })),
  on(AuthActions.LoginSuccess, (state, { accessToken }) => ({ ...state, isLoading: false, isAuth: true, accessToken })),
  on(AuthActions.LoginFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),

  on(AuthActions.GetAuthUser, state => ({ ...state, isLoading: true })),
  on(AuthActions.GetAuthUserSuccess, (state, { user, accessToken }) => ({ ...state, isLoading: false, user, accessToken, isAuth: true })),
  on(AuthActions.GetAuthUserFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),

  on(AuthActions.Logout, state => ({ ...state, isLoading: false, isAuth: false, accessToken: null, user: null })),
)

export function authReducer(state: AuthState, action: Action) {
  // state is the state of reducer and action is what we change in our state
  return reducer(state, action);
}