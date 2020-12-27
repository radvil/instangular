import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { RefreshToken, AuthUser } from './refresh-token.model';

export interface TokenResponse {
  payload: AuthUser;
  token: Buffer | string;
  expiresIn: Date;
}

export function createAccessToken(authUser: AuthUser): Promise<TokenResponse> {
  const secret = process.env.JWT_SECRET as jwt.Secret;
  const payload: AuthUser = { _id: authUser._id, role: authUser.role };
  const oneDay = Date.now() + 24 * 60 * 60 * 1000;
  return new Promise((resolve, reject) => {
    return jwt.sign(payload, secret, { expiresIn: oneDay }, (err, token: string) => {
      if (err) reject(err);
      else resolve(<TokenResponse>{ payload, token, expiresIn: new Date(oneDay) });
    });
  });
}

export async function createRefreshToken(authUser: AuthUser, ipAddress: string) {
  const oneWeek = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const newRefreshToken = new RefreshToken({
    ownedBy: authUser,
    token: createRandomCryptoString(),
    expiresIn: new Date(oneWeek),
    updatedByIp: ipAddress,
  });
  return new Promise<TokenResponse>((resolve, reject) => {
    newRefreshToken.save((err, result) => {
      if (err) return reject(err);
      const savedRefreshToken = {
        payload: { _id: result.ownedBy._id },
        token: result.token,
        expiresIn: result.expiresIn,
      } as TokenResponse;
      resolve(savedRefreshToken);
    })
  })
}

export async function renewRefreshToken(cookieRefToken: string, ipAddress: string) {
  const oneWeek = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const foundRefToken = await RefreshToken
    .findOne({ token: cookieRefToken })
    .populate('ownedBy', 'role');
  if (!foundRefToken) {
    throw 'No such refresh token'
  }
  const refreshToken = new RefreshToken({
    ownedBy: foundRefToken.ownedBy,
    token: createRandomCryptoString(),
    expiresIn: new Date(oneWeek),
    updatedByIp: ipAddress,
    oldToken: foundRefToken.token
  });
  try {
    const { ownedBy, token, expiresIn } = await refreshToken.save();
    const payload = { _id: ownedBy._id };
    return <TokenResponse>{ payload, token, expiresIn };
  } catch (error) {
    throw(error);
  }
}

function createRandomCryptoString(): string {
  return crypto.randomBytes(40).toString('hex');
}
