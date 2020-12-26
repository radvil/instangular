import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../user';
import { RefreshToken } from './refresh-token.model';

export function generateAccessToken(user: User): Promise<string> {
  const secret = process.env.JWT_SECRET;
  const payload = {
    _id: user._id,
    username: user.username,
  };

  return new Promise((resolve, reject) => {
    return jwt.sign(payload, secret, { expiresIn: '1d' }, (err, token) => {
      err ? reject(err) : resolve(token);
    });
  });
}

export function generateRefreshToken(user: User, ipAddress: string): Promise<RefreshToken> {
  const newDoc = new RefreshToken({
    user: user._id,
    token: createRandomCryptoString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    created: {
      ip: ipAddress
    }
  });

  return new Promise((resolve, reject) => {
    newDoc.save((err, token) => (err ? reject(err) : resolve(token)));
  });
}

export function createRandomCryptoString(): string {
  return crypto.randomBytes(40).toString('hex');
}