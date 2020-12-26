import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { TokenObj } from '../interface';
import { RefreshToken, TokenOwner } from './refresh-token.model';

export function generateAccessToken(user: TokenOwner): Promise<TokenObj> {
  const secret = process.env.JWT_SECRET as jwt.Secret;
  const payload = { _id: user._id, username: user.username };
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
        } as TokenObj;
        resolve(tokenObj);
      }
    });
  });
}

export function generateRefreshToken(user: TokenOwner, ipAddress: string): Promise<TokenObj> {
  const newDoc = new RefreshToken({
    user: user._id,
    token: createRandomCryptoString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
          expiresIn: refToken.expires,
          created: { ip: refToken.created.ip },
        } as TokenObj;
        resolve(tokenObj);
      }
    });
  });
}

export function createRandomCryptoString(): string {
  return crypto.randomBytes(40).toString('hex');
}