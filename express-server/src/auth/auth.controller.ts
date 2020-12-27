import { CookieOptions, Router } from 'express';

import { AUTH_TOKEN_MISSING_EXCEPTION, UNAUTHORIZED_EXCEPTION } from '../exception';
import { Controller, JsonHttpResponse, RequestUser } from '../interface';
import { authorizeAccess, validationMiddleware } from '../middleware';
import { CreateUserDto, User } from '../user';
import { Req, Res, Next } from '../var/types';
import { AuthService } from './auth.service';
import { AuthDto, AuthResponse } from './auth.model';
import { RefreshToken } from './refresh-token.model';

export class AuthController implements Controller {
  public path = '/auth';
  public router = Router();
  private _authSrv = new AuthService();

  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post(`${this.path}/register`, validationMiddleware<CreateUserDto>(CreateUserDto), this.register);
    this.router.post(`${this.path}/login`, validationMiddleware<AuthDto>(AuthDto), this.login);
    this.router.get(`${this.path}/refresh-token`, this.refreshToken);
    this.router.post(`${this.path}/revoke-token`, authorizeAccess(), this.revokeToken);
    this.router.post(`${this.path}/revoke-all-tokens`, authorizeAccess(), this.revokeAllTokens);
    this.router.get(`${this.path}/request-auth-user`, authorizeAccess(), this.requestAuthUser);
    this.router.get(`${this.path}/:userId/user-refresh-tokens`, authorizeAccess(), this.getAllUserRefreshTokens);
  }

  register = async (req: Req, res: Res, next: Next): Promise<void> => {
    try {
      const registeredUser = await this._authSrv.register(<CreateUserDto>req.body);
      const jsonResponse: JsonHttpResponse<User> = {
        status: 200,
        message: "Registration succeed",
        data: registeredUser
      }
      res.send(jsonResponse);
    } catch (error) {
      next(error);
    }
  }

  login = async (req: Req, res: Res, next: Next): Promise<void> => {
    const body = <AuthDto>{ ...req.body, ipAddress: req.ip };
    try {
      const { accessToken, refreshToken } = await this._authSrv.login(body);
      this.setRefreshTokenCookie(res, refreshToken);
      const jsonResponse: JsonHttpResponse<AuthResponse> = {
        status: 200,
        message: "Authentication succeed",
        data: { accessToken, refreshToken }
      }
      res.json(jsonResponse);
    } catch (error) {
      next(error);
    }
  }

  refreshToken = async (req: Req, res: Res, next: Next): Promise<void> => {
    const tokenStr = req.cookies.refreshToken;
    const ipAddress = req.ip;
    try {
      const { accessToken, refreshToken } = await this._authSrv.refreshToken({ tokenStr, ipAddress });
      this.setRefreshTokenCookie(res, refreshToken);
      res.json(<JsonHttpResponse<AuthResponse>>{
        status: 200,
        message: 'Refresh token succeed',
        data: { accessToken, refreshToken }
      });
    } catch (error) {
      next(error);
    }
  }

  revokeToken = async (req: RequestUser, res: Res, next: Next): Promise<void> => {
    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;
    if (!token) {
      next(new AUTH_TOKEN_MISSING_EXCEPTION());
    }
    if (!req.user.ownsToken(token)) {
      next(new UNAUTHORIZED_EXCEPTION());
    }
    try {
      await this._authSrv.expireRefreshToken({ token, ipAddress });
      this.setRefreshTokenCookie(res, null);
      res.json(<JsonHttpResponse<any>>{
        status: 200,
        message: 'Token has been revoked'
      });
    } catch (error) {
      next(error);
    }
  }

  revokeAllTokens = async (req: RequestUser, res: Res, next: Next): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;
    if (!req.user.ownsToken(refreshToken)) {
      next(new AUTH_TOKEN_MISSING_EXCEPTION())
    }
    try {
      await this._authSrv.expireAllRefreshTokens(req.user._id);
      this.setRefreshTokenCookie(res, null);
      res.json(<JsonHttpResponse<string>>{
        status: 200,
        message: 'All tokens revoked'
      });
    } catch (error) {
      next(error)
    }
  }

  requestAuthUser = async (req: RequestUser, res: Res, next: Next): Promise<void> => {
    try {
      const requestedUser = await this._authSrv.getUserById(req.user._id);
      res.json(<JsonHttpResponse<User>>{
        status: 200,
        message: 'Request AuthUser succeed',
        data: requestedUser
      });
    } catch (error) {
      next(error);
    }
  }

  getAllUserRefreshTokens = async (req: RequestUser, res: Res, next: Next): Promise<void> => {
    if (req.params.userId !== req.user._id) {
      next(new UNAUTHORIZED_EXCEPTION())
    }
    try {
      const refreshTokens = await this._authSrv.getUserRefreshTokenList(req.params.id);
      res.json(<JsonHttpResponse<RefreshToken[]>>{
        status: 200,
        message: 'Get all refresh tokens succeed!',
        data: refreshTokens
      })
    } catch (error) {
      next(error)
    }
  }

  protected setRefreshTokenCookie(res: Res, refreshToken: Buffer) {
    const options: CookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    return res.cookie('refreshToken', refreshToken, options);
  }
}