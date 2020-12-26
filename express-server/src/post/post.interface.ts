import { Document } from "mongoose";

export interface Post extends Document {
  authorId: string;
  title: string;
  content: string;
  thumbnail?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}