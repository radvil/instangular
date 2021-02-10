import { IsString, MinLength, IsEmail, IsOptional, MaxLength, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  public username: string;

  @IsString()
  public name: string;

  @IsString()
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(8)
  public password: string;

  @IsOptional()
  public image?: string;
}

export class UserBasicsInfoDto {
  @IsOptional()
  @IsString()
  public name?: string;

  @IsOptional()
  @IsString()
  public bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  public websiteLink?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  public facebookLink?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  public twitterLink?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  public githubLink?: string;
}

export class UserSensitivesInfoDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  public username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @IsEmail()
  public email: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  public oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  public newPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  public confirmNewPassword: string;
}