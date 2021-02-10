import { Schema, model, Document, SchemaOptions } from 'mongoose';
import { compare as bcryptCompare, hash as bcryptHash } from 'bcrypt';
import { USER_POPULATE_SELECT } from '../var';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export interface User extends Document {
  _id: string;
  username: string;
  email: string;
  name: string;
  photo?: string;
  photoThumb?: string;
  role?: Role;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoggedInAt?: string;
  lastPasswordUpdatedAt?: string;
  // basic info
  bio?: string;
  websiteLink?: string;
  facebookLink?: string;
  twitterLink?: string;
  githubLink?: string;
  validatePassword: (plainPassword: string) => Promise<boolean>,
}

const schemaOptions: SchemaOptions = {
  timestamps: true,
  toObject: { virtuals: true, versionKey: false },
  toJSON: {
    virtuals: true,
    getters: true,
    versionKey: false,
    transform: function (doc: Document, ret: User) {
      if (ret.photo) {
        ret.photo = process.env.PUBLIC_IMAGE_PATH + ret.photo;
      }
      if (ret.photoThumb) {
        ret.photoThumb = process.env.PUBLIC_IMAGE_PATH + ret.photoThumb;
      }
      delete ret.__v;
      delete ret.id;
      delete ret.password;
      // delete ret.lastPasswordUpdatedAt;
      // delete ret.email;
      // delete ret.role;
    }
  }
}

const schema = new Schema<User>({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  name: { type: String, maxlength: 100, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user', required: true },
  photo: { type: String, maxlength: 1000 },
  photoThumb: { type: String, maxlength: 1000 },
  password: String,
  lastPasswordUpdatedAt: String,
  lastLoggedInAt: Date,
  bio: { type: String, maxlength: 500 },
  websiteLink: { type: String, maxlength: 1000 },
  facebookLink: { type: String, maxlength: 1000 },
  twitterLink: { type: String, maxlength: 1000 },
  githubLink: { type: String, maxlength: 1000 },
}, schemaOptions);

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this['password'] = await bcryptHash(this['password'], 10);
    return next();
  } catch (error) {
    return next(error);
  }
});

schema.methods.validatePassword = function (plainPassword: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    return bcryptCompare(plainPassword, this.password, (err, matched) => {
      if (err) return reject(err);
      return resolve(matched)
    })
  })
};

schema.virtual('posts', {
  ref: 'Post',
  foreignField: 'postedBy',
  localField: '_id',
  options: {
    sort: { createdAt: -1 },
    limit: 10,
    populate: [
      { path: 'postedBy', select: USER_POPULATE_SELECT },
      { path: 'commentsCount' },
      { path: 'reactionsCount' },
    ],
  }
});

schema.virtual('postsCount', {
  ref: 'Post',
  foreignField: 'postedBy',
  localField: '_id',
  count: true,
});

export const User = model<User>('User', schema);
