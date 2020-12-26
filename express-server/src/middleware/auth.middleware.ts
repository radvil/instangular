import { verify as jwtVerify } from 'jsonwebtoken';

import { AUTH_TOKEN_MISSING_EXCEPTION, UNAUTHORIZED_EXCEPTION } from '../exception';
import { TokenPayload, RequestUser, CookieOptions } from '../interface';
import { Res, Next } from '../var/types';
import { userModel } from '../user';

export async function authMiddleware(req: RequestUser, res: Res, next: Next) {
  const secret = process.env.JWT_SECRET;
  const cookieOptions: CookieOptions = req.cookies;
  const cookieToken = cookieOptions.JWT;

  if (!cookieToken) {
    return next(new AUTH_TOKEN_MISSING_EXCEPTION());
  }

  try {
    const verifiedToken = jwtVerify(cookieToken, secret) as TokenPayload;
    const idFromToken = verifiedToken._id;
    const user = await userModel.findById(idFromToken);

    if (!user) {
      next(new UNAUTHORIZED_EXCEPTION());
    }

    req.user = user;
    next();
  } catch (error) {
    next(new UNAUTHORIZED_EXCEPTION());
  }
}