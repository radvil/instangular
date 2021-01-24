import { User } from "src/app/user/interfaces";

export interface PostReaction {
  reactedBy: User;
  variant: string;
  postId?: string;
}