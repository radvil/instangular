import { createAction, props } from "@ngrx/store";

import { User } from "src/app/user";
import { UserBasicsInfoDto } from "src/app/user/interfaces/user-basic-info.dto";
import { LoginDto, UserRegistrationDto } from "../interfaces";

export enum AuthActionsType {
  LOGIN = '[Auth/Api] Login',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_FAILURE = '[Auth] Login Failure',

  REGISTER_USER = '[Auth/Api] Register User',
  REGISTER_USER_SUCCESS = '[Auth/Api] Register User Success',
  REGISTER_USER_FAILURE = '[Auth/Api] Register User Failure',

  GET_AUTH_USER = '[Auth/Api] Get AuthUser',
  GET_AUTH_USER_SUCCESS = '[Auth] Get AuthUser Success',
  GET_AUTH_USER_FAILURE = '[Auth] Get AuthUser Failure',

  CHANGE_PROFILE_PHOTO = '[Auth] Change Profile Photo',
  UPDATE_PROFILE_BASICS_INFO = '[Auth] Update Profile Basics Info',

  LOGOUT = '[Auth] Logout',
}

export const Login = createAction(
  AuthActionsType.LOGIN,
  props<{ loginDto: LoginDto }>()
)
export const LoginSuccess = createAction(
  AuthActionsType.LOGIN_SUCCESS,
)
export const LoginFailure = createAction(
  AuthActionsType.LOGIN_FAILURE,
  props<{ error: Error }>()
)

export const RegisterUser = createAction(
  AuthActionsType.REGISTER_USER,
  props<{ dto: UserRegistrationDto }>()
)
export const RegisterUserSuccess = createAction(
  AuthActionsType.REGISTER_USER_SUCCESS,
)
export const RegisterUserFailure = createAction(
  AuthActionsType.REGISTER_USER_FAILURE,
  props<{ error: Error }>()
)

export const GetAuthUser = createAction(
  AuthActionsType.GET_AUTH_USER,
)
export const GetAuthUserSuccess = createAction(
  AuthActionsType.GET_AUTH_USER_SUCCESS,
  props<{ user: User }>()
)
export const GetAuthUserFailure = createAction(
  AuthActionsType.GET_AUTH_USER_FAILURE,
  props<{ error: Error }>()
)

export const ChangeProfilePhoto = createAction(
  AuthActionsType.CHANGE_PROFILE_PHOTO,
  props<{ photo: string, photoThumb: string }>()
)

export const UpdateProfileBasicsInfo = createAction(
  AuthActionsType.UPDATE_PROFILE_BASICS_INFO,
  props<{ dto: UserBasicsInfoDto }>()
)

export const Logout = createAction(
  AuthActionsType.LOGOUT,
)