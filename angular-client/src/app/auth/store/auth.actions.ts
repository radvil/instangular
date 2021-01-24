import { createAction, props } from "@ngrx/store";

import { User } from "src/app/user";
import { LoginDto } from "../interfaces";

export enum AuthActionsType {
  LOGIN = '[Auth/Api] Login',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_FAILURE = '[Auth] Login Failure',

  GET_AUTH_USER = '[Auth/Api] Get AuthUser',
  GET_AUTH_USER_SUCCESS = '[Auth] Get AuthUser Success',
  GET_AUTH_USER_FAILURE = '[Auth] Get AuthUser Failure',

  LOGOUT = '[Auth] Logout',
}

export const Login = createAction(
  AuthActionsType.LOGIN,
  props<{ loginDto: LoginDto }>()
)
export const LoginSuccess = createAction(
  AuthActionsType.LOGIN_SUCCESS,
  props<{ accessToken: string }>()
)
export const LoginFailure = createAction(
  AuthActionsType.LOGIN_FAILURE,
  props<{ error: Error }>()
)

export const GetAuthUser = createAction(
  AuthActionsType.GET_AUTH_USER,
)
export const GetAuthUserSuccess = createAction(
  AuthActionsType.GET_AUTH_USER_SUCCESS,
  props<{ user: User, accessToken: string }>()
)
export const GetAuthUserFailure = createAction(
  AuthActionsType.GET_AUTH_USER_FAILURE,
  props<{ error: Error }>()
)

export const Logout = createAction(
  AuthActionsType.LOGOUT,
)