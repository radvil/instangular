import { createAction, props } from "@ngrx/store";
import { User } from "../user.interface";

export enum UserActionTypes {

  GET_USER = '[User/API] Get User',
  GET_USER_SUCCESS = '[User/API] Get User Success',
  GET_USER_FAILURE = '[User/API] Get User Failure',

}

export const GetUser = createAction(
  UserActionTypes.GET_USER,
  props<{ username: string }>()
);
export const GetUserSuccess = createAction(
  UserActionTypes.GET_USER_SUCCESS,
  props<{ user: User }>()
);
export const GetUserFailure = createAction(
  UserActionTypes.GET_USER_FAILURE,
  props<{ error: Error }>()
);
