export class UpdatePostDto {
  _id?: string;
  description: string;
  tags?: string[];
}

export class CreatePostDto extends UpdatePostDto {
  image: File;
}