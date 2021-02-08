import { Schema, model, Document, SchemaOptions } from 'mongoose';
import { Role } from '../user';

export interface AuthUser {
  _id: string;
  role?: Role;
  ownsToken?: (token: string) => boolean;
}
export interface RefreshToken extends Document {
  ownedBy: AuthUser;
  token: Buffer | string;
  expiresIn: Date;
  createdAt: Date;
  createdByIp: string;
  updatedAt: Date;
  updatedByIp: string;
  oldToken?: Buffer | string;
  isActive?: boolean;
  isExpired?: boolean;
}
const schemaOptions: SchemaOptions = {
  timestamps: true,
  toObject: { virtuals: true, versionKey: false },
  toJSON: {
    virtuals: true,
    getters: true,
    versionKey: false,
    transform: function (doc: Document, ret: RefreshToken) {
      delete ret._id;
      delete ret.ownedBy;
    }
  }
}
const schema = new Schema<RefreshToken>({
  ownedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  expiresIn: Date,
  createdByIp: String,
  updatedByIp: String,
  oldToken: String,
}, schemaOptions);
schema.virtual('isExpired').get(function () {
  // return Date.now() >= this.expiresIn;
  const hasExpired = Date.now() >= new Date(this.expiresIn).getTime();
  console.log(hasExpired);
  return hasExpired;
});
schema.virtual('isActive').get(function () {
  return !this.updatedAt && !this.isExpired;
});
schema.index({ ownedBy: 1 });
export const RefreshToken = model<RefreshToken>('RefreshToken', schema);
