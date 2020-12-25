import { IsString, IsNotEmpty, MaxLength, IsOptional, IsDateString, IsArray } from "class-validator";

export class CreatePostDto {
  // @IsNotEmpty()
  // @IsString()
  // @MaxLength(1000)
  public description: string;

  // @IsNotEmpty()
  public image: string;

  // @IsOptional()
  // @IsArray()
  public tags: string[];

  // @IsOptional()
  // @IsDateString()
  public updatedAt: Date;
}