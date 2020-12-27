import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../interface';
import { RefreshToken, AuthUser } from './refresh-token.model';

export interface GeneratedToken {
  user: AuthUser;
  token: Buffer | string;
  expiresIn: number | string;
  created?: {
    ip: string;
    date?: string;
  }
}

export function generateAccessToken(user: AuthUser): Promise<GeneratedToken> {
  const secret = process.env.JWT_SECRET as jwt.Secret;
  const payload: TokenPayload = { _id: user._id, username: user.username, role: user.role };
  const expiresIn = '1d';
  return new Promise((resolve, reject) => {
    return jwt.sign(payload, secret, { expiresIn }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        const tokenObj = {
          user: payload,
          token,
          expiresIn,
        } as GeneratedToken;
        resolve(tokenObj);
      }
    });
  });
}

export function generateRefreshToken(user: AuthUser, ipAddress: string): Promise<GeneratedToken> {
  const newDoc = new RefreshToken({
    user: user._id,
    token: createRandomCryptoString(),
    expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    created: {
      ip: ipAddress
    }
  });
  return new Promise((resolve, reject) => {
    newDoc.save((err, refToken) => {
      if (err) {
        reject(err);
      } else {
        const tokenObj = {
          user: { _id: refToken.user._id },
          token: refToken.token,
          expiresIn: refToken.expiresIn,
          created: { ip: refToken.created.ip },
        } as GeneratedToken;
        resolve(tokenObj);
      }
    });
  });
}

export function createRandomCryptoString(): string {
  return crypto.randomBytes(40).toString('hex');
}
