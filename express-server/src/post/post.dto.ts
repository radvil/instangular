import { IsString, IsNotEmpty, MaxLength, MinLength, IsOptional, IsDateString } from "class-validator";

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  public title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  public content: string;

  // @IsOptional()
  // @IsString()
  // public thumbnail: string;

  // @IsOptional()
  // @IsString()
  @IsNotEmpty()
  public image: string;

  @IsOptional()
  @IsDateString()
  public updatedAt: Date;
}