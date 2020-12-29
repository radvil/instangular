import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Schema, model, Document, SchemaOptions } from 'mongoose';
import { User } from '../user';

export interface Comment extends Document {
  _id: string;
  postId: string;
  commentedBy: User;
  text: string;
  createdAt: string;
  likes?: any[];
  likesCount?: number;
}

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  postId: string;

  @IsString()
  @MinLength(1)
  text: string;

  @IsNotEmpty()
  @IsString()
  commentedBy: any;
}

const schemaOptions: SchemaOptions = {
  toObject: { virtuals: true, versionKey: false },
  toJSON: {
    virtuals: true,
    getters: true,
    versionKey: false,
    transform: function (doc: Document, ret: Comment) {
      delete ret.__v;
      delete ret.id;
      delete ret.postId;
    }
  }
}

const schema = new Schema<Comment>({
  postId: {
    ref: 'Post',
    type: Schema.Types.ObjectId,
    required: true,
  },
  commentedBy: {
    ref: 'User',
    type: Schema.Types.ObjectId,
    required: true,
  },
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, schemaOptions);

schema.virtual('reactions', {
  ref: 'CommentReaction',
  foreignField: 'commentId',
  localField: '_id',
});

schema.virtual('reactionsCount', {
  ref: 'CommentReaction',
  foreignField: 'commentId',
  localField: '_id',
  count: true
});

export const Comment = model<Comment>('Comment', schema);