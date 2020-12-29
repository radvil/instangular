import { Schema, Document, SchemaOptions, model } from "mongoose";

export interface PostReaction extends Document {
  reactedBy: string;
  variant: string;
  postId: string;
}

export interface CommentReaction extends Document {
  reactedBy: string;
  variant: string;
  commentId: string;
}

const postReactionSchema = new Schema<PostReaction>({
  reactedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  variant: {
    type: String,
    enum: ['like', 'love', 'haha', 'huhu', 'angry', 'care'],
    default: 'love'
  }
}, <SchemaOptions>{
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc: Document, ret: PostReaction) {
      delete ret.__v;
      delete ret.id;
      delete ret.postId;
    }
  }
});

const commentReactionSchema = new Schema<CommentReaction>({
  reactedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  commentId: { type: Schema.Types.ObjectId, ref: 'Comment', required: true },
  variant: {
    type: String,
    enum: ['like', 'love', 'haha', 'huhu', 'angry', 'care'],
    default: 'love'
  }
}, <SchemaOptions>{
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc: Document, ret: CommentReaction) {
      delete ret.__v;
      delete ret.id;
      delete ret.commentId;
    }
  }
});

export const PostReaction = model<PostReaction>('PostReaction', postReactionSchema);
export const CommentReaction = model<CommentReaction>('CommentReaction', commentReactionSchema);
