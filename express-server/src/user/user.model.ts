import { Schema, model } from 'mongoose';
import { User } from './user.interface';

const addressSchema = new Schema({
  street: String,
  city: String,
  country: String,
  postalCode: Number,
});

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  address: addressSchema,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  lastLoggedInAt: Date
}, { toJSON: { virtuals: true, getters: true } });

userSchema
  .virtual('fullName')
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author',
});

export const userModel = model<User>('User', userSchema);
