import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Schema, model, Document } from 'mongoose';
import { User } from '../user';
import { Post } from '../post';

export interface Comment extends Document {
  _id: string;
  post: Post;
  author: User;
  text: string;
  createdAt: string;
}

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  postId: string;

  @IsNotEmpty()
  @IsString()
  authorId: string;

  @IsString()
  @MinLength(1)
  text: string;
}

const schema = new Schema<Comment>({
  post: {
    ref: 'Post',
    type: Schema.Types.ObjectId,
  },
  author: {
    ref: 'User',
    type: Schema.Types.ObjectId,
  },
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

schema.set('toJSON', {
  virtuals: true,
  getters: true,
  versionKey: false,
  transform: function (doc: Document, ret: Comment) {
    // remove these props when object is serialized
    delete ret.__v;
    delete ret.id;
  }
});

export const Comment = model<Comment>('Comment', schema);