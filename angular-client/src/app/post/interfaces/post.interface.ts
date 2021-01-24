import { User } from "src/app/user";
import { Comment } from 'src/app/comment';
import { PostReaction } from "./post-reaction.interface";

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