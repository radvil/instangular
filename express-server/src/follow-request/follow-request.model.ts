import { model, Schema, SchemaOptions, Document } from "mongoose";
import { User } from "../user";

export interface FollowRequest extends Document {
  isApproved: boolean;
  sender: User | string;
  receiver: string;
  createdAt: string;
  updatedAt: string;
}

const schema = new Schema<FollowRequest>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const FollowRequest = model<FollowRequest>('FollowRequest', schema);
