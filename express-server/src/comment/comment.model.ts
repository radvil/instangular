import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Schema, model, Document, SchemaOptions } from 'mongoose';

import { sortByDate } from '../util/sort-by-date';
import { User } from '../user';

export interface Comment extends Document {
  _id: string;
  postId: string;
  commentedBy: User;
  text: string;
  repliedTo: string;
  createdAt: string;

  replies?: Comment[];
  repliesCount?: number;
  reactions?: any[];
  reactionsCount?: number;
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
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc: Document, ret: Comment) {
      delete ret.__v;
      delete ret.id;

      if (ret.replies?.length) {
        ret.replies = ret.replies.sort((a, b) => sortByDate(a.createdAt, b.createdAt));
      }
    }
  }
}

const schema = new Schema<Comment>({
  postId: {
    ref: 'Post',
    type: Schema.Types.ObjectId,
    required: true,
  },
  repliedTo: {
    type: String
  },
  commentedBy: {
    ref: 'User',
    type: Schema.Types.ObjectId,
    required: true,
  },
  text: String,
}, schemaOptions);

schema.virtual('postRef', {
  ref: 'Post',
  foreignField: '_id',
  localField: 'postId',
  justOne: true,
});

schema.virtual('reactions', {
  ref: 'CommentReaction',
  foreignField: 'commentId',
  localField: '_id',
});

schema.virtual('reactionsCount', {
  ref: 'CommentReaction',
  foreignField: 'commentId',
  localField: '_id', // CommentSchemaId
  count: true,
});

schema.virtual('myReaction', {
  ref: 'CommentReaction',
  foreignField: 'commentId',
  localField: '_id',
  justOne: true,
});

schema.virtual('replies', {
  ref: 'Comment',
  foreignField: 'repliedTo',
  localField: '_id',
});

schema.virtual('repliesCount', {
  ref: 'Comment',
  foreignField: 'repliedTo',
  localField: '_id',
  options: {
    where: { repliedTo: { $ne: null } },
  },
  count: true,
});


export const Comment = model<Comment>('Comment', schema);