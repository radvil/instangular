import { User } from "../users";

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