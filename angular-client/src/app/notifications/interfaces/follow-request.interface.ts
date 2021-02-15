import { UserBasic } from "../../user";

export interface FollowRequest {
  isApproved: boolean;
  sender: UserBasic;
  receiver: string;
  createdAt: string;
  updatedAt: string;
}

export class FollowRequestDto {
  isApproved: boolean;
  senderId: string;
  receiverId: string;
}