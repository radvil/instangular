import { User } from "../user";
import { Comment } from '../comment';

export interface Post {
  _id: string;
  postedBy: User;
  description: string;
  tags?: string[];
  thumbnail?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  likes?: any[];
  likesCount?: number;
  comments?: Comment[];
  commentsCount?: number;
  commentsAsParentCount?: number;
  reactions?: PostReaction[];
  reactionsCount?: number;
}

export interface PostReaction {
  reactedBy: User;
  variant: string;
  postId?: string;
}

export class CreatePostDto {
  description: string;
  tags?: string[];
}