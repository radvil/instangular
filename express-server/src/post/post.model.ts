import { Schema, model } from 'mongoose';
import { Post } from './post.interface';

const postSchema = new Schema({
  author: {
    ref: 'User',
    type: Schema.Types.ObjectId,
  },
  title: String,
  content: String,
  thumbnail: String,
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
});

export const postModel = model<Post>('Post', postSchema);
