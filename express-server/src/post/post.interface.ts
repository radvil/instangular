import { Document } from "mongoose";

export interface Post extends Document {
  authorId: string;
  description: string;
  tags?: string[];
  thumbnail?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}