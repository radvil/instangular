import { Schema, model, Document } from 'mongoose';

export interface TokenOwner {
  _id: string;
  username: string;
}

export interface RefreshToken extends Document {
  user: TokenOwner;
  token: string;
  expires: string;
  created: { date: string; ip: string },
  revoked: {date: string; ip: string },
  replacementToken: string;
}

const schema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	token: String,
	expires: Date,
	created: {
		date: { type: Date, default: Date.now },
		ip: String
	},
	revoked: {
		date: Date,
		ip: String
	},
	replaceToken: String
});

schema.virtual('isExpired').get(function () {
	return Date.now() >= this.expires;
});

schema.virtual('isActive').get(function () {
	return !this.revoked.date && !this.isExpired;
});

schema.set('toJSON', {
  virtuals: true,
  getters: true,
	versionKey: false,
	transform: function (doc: Document, ret: RefreshToken) {
		// remove these props when object is serialized
		delete ret._id;
		delete ret.id;
		delete ret.user;
	}
});

export const RefreshToken = model<RefreshToken>('RefreshToken', schema);
