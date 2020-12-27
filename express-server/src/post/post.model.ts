import { Schema, model, Document, SchemaOptions } from 'mongoose';

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
}

const schemaOptions: SchemaOptions = {
  timestamps: true,
  toObject: { virtuals: true, versionKey: false },
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

const schema = new Schema({
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

export const Post = model<Post>('Post', schema);
