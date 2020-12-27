import { Schema, model, Document } from 'mongoose';
import { compare as bcryptCompare, hash as bcryptHash } from 'bcrypt';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export interface User extends Document {
  _id: string;
  username: string;
  email: string;
  role?: Role;
  firstName: string;
  lastName: string;
  fullName?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoggedInAt?: string;
  address?: {
    street: string;
    city: string;
    country: string;
    postalCode: number;
  },
  validatePassword: (plainPassword: string) => Promise<boolean>,
}

const addressSchema = new Schema({
  street: String,
  city: String,
  country: String,
  postalCode: Number,
});

const userSchema = new Schema<User>({
  username: {
    type: String,
    unique: true,
  },
  email: String,
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  firstName: String,
  lastName: String,
  password: String,
  address: addressSchema,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  lastLoggedInAt: Date
}, { toJSON: { virtuals: true, getters: true } });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this['password'] = await bcryptHash(this['password'], 10);

    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.validatePassword = function (plainPassword: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    return bcryptCompare(plainPassword, this.password, (err, matched) => {
      if (err) return reject(err);
      return resolve(matched)
    })
  })
};

userSchema.set('toJSON', {
  virtuals: true,
  getters: true,
  versionKey: false,
  transform: function (doc: Document, ret: User) {
    // remove these props when object is serialized
    delete ret.__v;
    delete ret.id;
    delete ret.firstName;
    delete ret.lastName;
    delete ret.password;
  }
});

userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author',
});


export const User = model<User>('User', userSchema);
