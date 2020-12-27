import { JsonWebTokenError, TokenExpiredError, verify as jwtVerify } from 'jsonwebtoken';

import { AUTH_TOKEN_MISSING_EXCEPTION, UNAUTHORIZED_EXCEPTION } from '../exception';
import { RequestUser } from '../interface';
import { AuthUser } from '../auth';
import { Res, Next } from '../var/types';
import { Role, User } from '../user';
import { RefreshToken } from '../auth';

/**
 * @param roles be a single role (e.g. Role.User or 'User') or array (e.g [Role.Admin])
 * ### usage::
 *     authorizeAccess() (or)
 *     authorizeAccess('Admin') (or)
 *     authorizeAccess(['Admin'])
 * 
*/
export const authorizeAccess = (roles = []) => {
  if (typeof roles === 'string') roles = [roles];
  return [verifyToken(), verifyRole(roles)];
}

function verifyToken() {
  return async (req: RequestUser, res: Res, next: Next) => {
    const secret = process.env.JWT_SECRET;
    const authHeader = req.headers.authorization || req.get('Authorization');
    if (!authHeader) {
      next(new AUTH_TOKEN_MISSING_EXCEPTION());
    }
    try {
      const userFromVerifiedToken = jwtVerify(authHeader, secret) as AuthUser;
      const user = userFromVerifiedToken || await User.findById(userFromVerifiedToken._id);
      if (!user) {
        next(new UNAUTHORIZED_EXCEPTION());
      }
      req.user = user;
      next();
    } catch (error) {
      const errorMessage = (error instanceof JsonWebTokenError)
        ? 'Token has been expired'
        : error.message;
      next(new UNAUTHORIZED_EXCEPTION(errorMessage));
    }
  }

}
function verifyRole(roles: Role | Role[]) {
  return async (req: RequestUser, res: Res, next: Next) => {
    const isAuthenticated = !!req.user;
    const isAuthButHasWrongRole = !!(roles.length && !roles.includes(req.user.role));
    if (!isAuthenticated || isAuthButHasWrongRole) {
      next(new UNAUTHORIZED_EXCEPTION());
    }
    try {
      const refreshTokens = await RefreshToken.find({ ownedBy: req.user._id } as any);
      if (!refreshTokens) {
        next(new UNAUTHORIZED_EXCEPTION());
      }
      req.user.ownsToken = (token: string) => !!refreshTokens.find(x => x.token === token);
      next();
    } catch (error) {
      next(new UNAUTHORIZED_EXCEPTION());
    }
  }
}