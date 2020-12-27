import { IsIP, IsOptional, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  public username: string;
  @IsString()
  public password: string;
  @IsOptional()
  @IsIP()
  public ipAddress?: string;
}

export interface AuthResponse {
  accessToken: Buffer;
  refreshToken: Buffer;
}