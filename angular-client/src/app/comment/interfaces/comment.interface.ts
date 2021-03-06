import { PostReaction } from "src/app/post";
import { User } from "src/app/user/interfaces";

export interface PostComment {
  _id: string;
  postId: string;
  commentedBy: User;
  postRef?: { // if commentAsParent
    _id: string;
    postedBy: User;
  };
  repliedTo?: string; // if commentAsReply
  text: string;
  createdAt: string;
  reactions: PostReaction[];
  reactionsCount: number;
  replies: PostComment[];
  repliesCount: number;
  myReaction?: CommentReaction;
}

export interface CommentReaction {
  _id?: string;
  postId: string;
  commentId?: string;
  reactedBy: User;
  variant: string;
}