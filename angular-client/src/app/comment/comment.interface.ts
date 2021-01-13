import { User } from "../user";

export interface Comment {
  _id: string;
  postId: string;
  commentedBy: User;
  text: string;
  createdAt: string;
  likes?: any[];
  likesCount?: number;
}

export class CreateCommentDto {
  postId: string;
  commentedBy: string;
  text: string;
}