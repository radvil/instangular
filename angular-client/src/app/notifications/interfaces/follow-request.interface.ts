import { UserBasic } from "../../user";

export interface FollowRequest {
  isApproved: boolean;
  requester: UserBasic;
  receiver: string;
  createdAt: string;
  updatedAt: string;
}

export class FollowRequestDto {
  requesterId: string;
  receiverId: string;
}