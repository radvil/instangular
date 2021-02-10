import { createAction, props } from "@ngrx/store";
import { User } from "../interfaces";
import { UserBasicsInfoDto, UserSensitivesInfoDto, UserUpdatePasswordDto } from "../interfaces/user.dto";

export enum UserActionTypes {

  GET_USER = '[User/API] Get User',
  GET_USER_SUCCESS = '[User/API] Get User Success',
  GET_USER_FAILURE = '[User/API] Get User Failure',

  UPLOAD_USER_PROFILE_PICTURE = '[User/API] Upload User Profile Picture',
  UPLOAD_USER_PROFILE_PICTURE_SUCCESS = '[User/API] Upload User Profile Picture Success',
  UPLOAD_USER_PROFILE_PICTURE_FAILURE = '[User/API] Upload User Profile Picture Failure',

  UPDATE_USER_BASICS_INFO = '[User/API] Update User Basics Info',
  UPDATE_USER_BASICS_INFO_SUCCESS = '[User/API] Update User Basics Info Success',
  UPDATE_USER_BASICS_INFO_FAILURE = '[User/API] Update User Basics Info Failure',

  UPDATE_USER_SENSITIVES_INFO = '[Account/API] Update User Sensitives Info',
  UPDATE_USER_SENSITIVES_INFO_SUCCESS = '[Account/API] Update User Sensitives Info Success',
  UPDATE_USER_SENSITIVES_INFO_FAILURE = '[Account/API] Update User Sensitives Info Failure',

  UPDATE_USER_PASSWORD = '[Account/API] Update User Password',
  UPDATE_USER_PASSWORD_SUCCESS = '[Account/API] Update User Password Success',
  UPDATE_USER_PASSWORD_FAILURE = '[Account/API] Update User Password Failure',

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

export const UploadUserProfilePicture = createAction(
  UserActionTypes.UPLOAD_USER_PROFILE_PICTURE,
  props<{ photo: File }>()
);
export const UploadUserProfilePictureSuccess = createAction(
  UserActionTypes.UPLOAD_USER_PROFILE_PICTURE_SUCCESS,
  props<{ user: User }>()
);
export const UploadUserProfilePictureFailure = createAction(
  UserActionTypes.UPLOAD_USER_PROFILE_PICTURE_FAILURE,
  props<{ error: Error }>()
);

export const UpdateUserBasicsInfo = createAction(
  UserActionTypes.UPDATE_USER_BASICS_INFO,
  props<{ dto: UserBasicsInfoDto }>()
);
export const UpdateUserBasicsInfoSuccess = createAction(
  UserActionTypes.UPDATE_USER_BASICS_INFO_SUCCESS,
  props<{ dto: UserBasicsInfoDto }>()
);
export const UpdateUserBasicsInfoFailure = createAction(
  UserActionTypes.UPDATE_USER_BASICS_INFO_FAILURE,
  props<{ error: Error }>()
);

export const UpdateUserSensitivesInfo = createAction(
  UserActionTypes.UPDATE_USER_SENSITIVES_INFO,
  props<{ dto: UserSensitivesInfoDto }>()
);
export const UpdateUserSensitivesInfoSuccess = createAction(
  UserActionTypes.UPDATE_USER_SENSITIVES_INFO_SUCCESS,
  props<{ dto: UserSensitivesInfoDto }>()
);
export const UpdateUserSensitivesInfoFailure = createAction(
  UserActionTypes.UPDATE_USER_SENSITIVES_INFO_FAILURE,
  props<{ error: Error }>()
);

export const UpdateUserPassword = createAction(
  UserActionTypes.UPDATE_USER_PASSWORD,
  props<{ dto: UserUpdatePasswordDto }>()
);
export const UpdateUserPasswordSuccess = createAction(
  UserActionTypes.UPDATE_USER_PASSWORD_SUCCESS,
);
export const UpdateUserPasswordFailure = createAction(
  UserActionTypes.UPDATE_USER_PASSWORD_FAILURE,
  props<{ error: Error }>()
);

