import { IsIP, IsOptional, IsString } from 'class-validator';

export class LogInDto {
  @IsString()
  public username: string;

  @IsString()
  public password: string;

  @IsOptional()
  @IsIP()
  public ipAddress?: string;
}