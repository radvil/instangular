import { Schema, model, Document, SchemaOptions } from 'mongoose';
import { PostReaction } from '../reaction';

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
  // options: {
  //   limit: 5,
  //   sort: { createdAt: -1 },
  //   where: { repliedTo: { $eq: null } },
  //   populate: [
  //     { path: 'commentedBy', select: USER_POPULATE_SELECT },
  //     { path: 'replies' }, // can't override options from commentSchema virtual
  //     { path: 'repliesCount' },
  //     { path: 'reactionsCount' },
  //   ]
  // }
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
  // options: {
  //   sort: { createdAt: -1 },
  //   limit: 5,
  //   populate: { path: 'reactedBy', select: USER_POPULATE_SELECT },
  // },
});

schema.virtual('reactionsCount', {
  ref: 'PostReaction',
  foreignField: 'postId',
  localField: '_id',
  count: true,
});

export const Post = model<Post>('Post', schema);
