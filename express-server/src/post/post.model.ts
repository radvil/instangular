import { Schema, model, Document } from 'mongoose';

export interface Post extends Document {
  author: any;
  description: string;
  tags?: string[];
  thumbnail?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  totaLikes?: number;
  totalComments?: number;
}

const postSchema = new Schema({
  author: {
    ref: 'User',
    type: Schema.Types.ObjectId,
  },
  description: String,
  tags: [String],
  thumbnail: String,
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
});

postSchema.set('toJSON', {
  virtuals: true,
  getters: true,
  versionKey: false,
  transform: function (doc: Document, ret: Post) {
    // set value
    ret.thumbnail = process.env.PUBLIC_IMAGE_PATH + '/' + ret.thumbnail;
    ret.image = process.env.PUBLIC_IMAGE_PATH + '/' + ret.image;
    // remove these props when object is serialized
    delete ret.__v;
    delete ret.id;
  }
});

postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
});

export const Post = model<Post>('Post', postSchema);
