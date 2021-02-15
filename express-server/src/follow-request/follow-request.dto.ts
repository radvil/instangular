import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateFollowReqDto {
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @IsOptional()
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  receiverId: string;
}