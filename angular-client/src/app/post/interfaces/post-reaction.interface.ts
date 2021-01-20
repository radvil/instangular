import { User } from "src/app/user/interfaces";

export interface PostReaction {
  _id?: string;
  postId?: string;
  reactedBy?: User;
  variant: string;
}