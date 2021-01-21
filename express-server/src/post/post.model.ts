import { Schema, model, Document, SchemaOptions } from 'mongoose';

import { Comment } from '../comment/comment.model';
import { sortByDate } from '../util/sort-by-date';

export interface Post extends Document {
  postedBy: any;
  description: string;
  tags?: string[];
  thumbnail?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  likes?: any[];
  likesCount?: number;
  comments?: Comment[];
  commentsCount?: number;
  myReaction?: any;
  generateMyReaction?: any;
}

const schemaOptions: SchemaOptions = {
  timestamps: true,
  // toObject: { virtuals: true, versionKey: false },
  toJSON: {
    virtuals: true,
    getters: true,
    versionKey: false,
    transform: function (doc: Document, ret: Post) {
      if (ret.thumbnail) {
        ret.thumbnail = process.env.PUBLIC_IMAGE_PATH + ret.thumbnail;
      }
      if (ret.image) {
        ret.image = process.env.PUBLIC_IMAGE_PATH + ret.image;
      }
      if (ret.comments?.length) {
        ret.comments = ret.comments.sort((a, b) => sortByDate(a.createdAt, b.createdAt));
      }
      delete ret.__v;
      delete ret.id;
    }
  }
}

const schema = new Schema<Post>({
  postedBy: { ref: 'User', type: Schema.Types.ObjectId, required: true },
  description: String,
  tags: [String],
  thumbnail: String,
  image: String,
}, schemaOptions);

schema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'postId',
  localField: '_id',
});

schema.virtual('commentsCount', {
  ref: 'Comment',
  foreignField: 'postId',
  localField: '_id',
  count: true,
});

schema.virtual('commentsAsParentCount', {
  ref: 'Comment',
  foreignField: 'postId',
  localField: '_id',
  options: {
    where: { repliedTo: { $eq: null } },
  },
  count: true,
});

schema.virtual('reactions', {
  ref: 'PostReaction',
  foreignField: 'postId',
  localField: '_id',
});

schema.virtual('reactionsCount', {
  ref: 'PostReaction',
  foreignField: 'postId',
  localField: '_id',
  count: true,
});

schema.virtual('myReaction', {
  ref: 'PostReaction',
  foreignField: 'postId',
  localField: '_id',
  justOne: true,
});

export const Post = model<Post>('Post', schema);
