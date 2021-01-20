import { Post } from "src/app/post/interfaces";
import { UserRole } from "./user-role.enum";

export interface User extends UserBasic {
  email: string;
  name: string;
  role?: UserRole;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  posts?: Post[];
  // basiscInfo
  bio?: string;
  websiteLink?: string;
  facebookLink?: string;
  twitterLink?: string;
  githubLink?: string;
}

export interface UserBasic {
  _id: string;
  username: string;
  photo: string;
  photoThumb: string;
  lastLoggedInAt: string;
}
