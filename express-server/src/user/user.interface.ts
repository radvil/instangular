import { Document } from "mongoose";

export interface User extends Document {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
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