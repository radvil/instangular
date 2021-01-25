import { User } from "src/app/user/interfaces";

export interface Comment {
  _id: string;
  postId: string;
  commentedBy: User;
  text: string;
  createdAt: string;
  reactions?: any[];
  reactionsCount?: number;
  replies?: Reply[];
}

export interface Reply {
  _id: string;
  postId?: string;
  repliedTo: string;
  commentedBy: User;
  text: string;
  createdAt: string;
  reactions?: any[];
  reactionsCount?: number;
}