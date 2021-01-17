import { User } from "../user";

export interface Comment {
  _id: string;
  postId: string;
  commentedBy: User;
  text: string;
  createdAt: string;
  likes?: any[];
  likesCount?: number;
  repliedTo?: string;
  replies?: Comment[];
}

export class CreateCommentDto {
  postId: string;
  commentedBy: string;
  text: string;
}

export class GetCommentsByPostIdDto {
  postId: string;
  pageNumber?: number;
  limit?: number;
}

export class GetRepliesByCommentIdDto {
  commentId: string;
  pageNumber?: number;
  limit?: number;
}