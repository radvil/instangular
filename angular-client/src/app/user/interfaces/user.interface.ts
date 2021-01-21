import { Post } from "src/app/post/interfaces";
import { UserRole } from "./user-role.enum";

export interface User {
  _id: string;
  username: string;
  email: string;
  name: string;
  photo?: string;
  photoThumb?: string;
  role?: UserRole;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoggedInAt?: string;
  posts?: Post[];
  // basiscInfo
  bio?: string;
  websiteLink?: string;
  facebookLink?: string;
  twitterLink?: string;
  githubLink?: string;
}
