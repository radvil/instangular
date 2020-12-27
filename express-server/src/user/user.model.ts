import { Schema, model, Document, SchemaOptions } from 'mongoose';
import { compare as bcryptCompare, hash as bcryptHash } from 'bcrypt';

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
        ret.photo = process.env.PUBLIC_IMAGE_PATH + '/' + ret.photo;
      }
      if (ret.photoThumb) {
        ret.photoThumb = process.env.PUBLIC_IMAGE_PATH + '/' + ret.photoThumb;
      }
      delete ret.__v;
      delete ret.id;
      delete ret.password;
      delete ret.email;
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
  lastLoggedInAt: Date,
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
});

export const User = model<User>('User', schema);
