import { User } from "src/app/user/interfaces";

export interface Comment {
  _id: string;
  postId: string;
  commentedBy: User;
  commentedToPost?: {
    _id: string;
    postedBy: User;
  };
  text: string;
  createdAt: string;
  reactions: any[];
  reactionsCount: number;
  replies: Reply[];
  myReaction?: CommentReaction;
}

export interface Reply {
  _id: string;
  postId: string;
  repliedTo: string;
  commentedBy: User;
  text: string;
  createdAt: string;
  reactions: any[];
  reactionsCount: number;
  myReaction?: CommentReaction;
}

export interface CommentReaction {
  _id?: string;
  commentId?: string;
  reactedBy?: User;
  variant: string;
}