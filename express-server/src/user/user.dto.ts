import { IsString, MinLength, IsEmail, IsOptional } from "class-validator";

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