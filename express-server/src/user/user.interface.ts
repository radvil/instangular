import { Document } from "mongoose";

export interface User extends Document {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  password: string;
  address?: {
    street: string;
    city: string;
    country: string;
    postalCode: number;
  }
}