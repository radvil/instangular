import { IsEmail, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { CreateAddressDto } from './address.dto';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  public username: string;

  // @IsOptional()
  @IsString()
  public firstName: string;

  // @IsOptional()
  @IsString()
  public lastName: string;

  @IsString()
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(8)
  public password: string;

  @IsOptional()
  @ValidateNested()
  public address?: CreateAddressDto;
}