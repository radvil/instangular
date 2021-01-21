import { User } from "src/app/user/interfaces";

export interface PostReaction {
  _id?: string;
  reactedBy?: User;
  postId: string;
  variant: string;
}