import { Document } from "mongoose";

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export interface User extends Document {
  _id: string;
  username: string;
  email: string;
  role?: Role;
  firstName: string;
  lastName: string;
  fullName?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoggedInAt?: string;
  address?: {
    street: string;
    city: string;
    country: string;
    postalCode: number;
  },
  validatePassword: (plainPassword: string) => Promise<boolean>,
}