import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Schema, model, Document, SchemaOptions } from 'mongoose';
import { User } from '../user';
import { PostReaction } from '../reaction';

export interface Comment extends Document {
  _id: string;
  postId: string;
  commentedBy: User;
  text: string;
  repliedTo: string;
  createdAt: string;
  likes?: any[];
  likesCount?: number;
  findMyReaction: any;
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