export class UserBasicsInfoDto {
  userId: string;
  name?: string;
  bio?: string;
  websiteLink?: string;
  facebookLink?: string;
  twitterLink?: string;
  githubLink?: string;
}

export class UserPhotoDto {
  userId: string;
  photo: File;
}

export class UserSensitivesInfoDto {
  userId: string;
  username: string;
  email: string;
}

export class UserUpdatePasswordDto {
  userId: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}