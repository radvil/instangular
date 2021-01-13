import { IsOptional, IsArray } from "class-validator";

export class CreatePostDto {
  // TODO: Validation doesn't work to multipart formdata
  public description: string;

  @IsOptional()
  @IsArray()
  public tags: string[];
}
