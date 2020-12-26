import { IsEmail, IsString } from 'class-validator';

export class LogInDto {
  @IsString()
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}