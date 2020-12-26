import { Post } from "../post";

export enum Role {
  USER = "user",
  ADMIN = "admin"
}

export interface UserAddress {
  street: string;
  city: string;
  country: string;
  postalCode: number;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  name: string;
  photo?: string;
  photoThumb?: string;
  role?: Role;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoggedInAt?: string;
  posts?: Post[];
}

export interface UserDetail extends User {
  address?: UserAddress;
}