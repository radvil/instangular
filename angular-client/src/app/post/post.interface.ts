import { User } from "../user";

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
  reactions?: PostReaction[];
  reactionsCount?: number;
}

export interface Comment {
  _id: string;
  postId: string;
  commentedBy: User;
  text: string;
  createdAt: string;
  likes?: any[];
  likesCount?: number;
}

export interface PostReaction {
  reactedBy: User;
  variant: string;
  postId?: string;
}