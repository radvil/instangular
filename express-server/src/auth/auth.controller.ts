import { CookieOptions, Router } from 'express';

import { AUTH_TOKEN_MISSING_EXCEPTION, INTERNAL_SERVER_EXCEPTION, NOT_FOUND_EXCEPTION, UNAUTHORIZED_EXCEPTION, WRONG_CREDENTIALS_EXCEPTION } from '../exception';
import { Controller, JsonHttpResponse, RequestUser } from '../interface';
import { authMiddleware, validationMiddleware } from '../middleware';
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
    this.router.post(`${this.path}/revoke-token`, authMiddleware, this.revokeToken);
    this.router.post(`${this.path}/revoke-all-tokens`, authMiddleware, this.revokeAllTokens);
    this.router.get(`${this.path}/request-auth-user`, authMiddleware, this.requestAuthUser);
    this.router.post(`${this.path}/request-new-password`, authMiddleware, this.updateUserPassword);
    this.router.get(`${this.path}/:userId/user-refresh-tokens`, authMiddleware, this.getAllUserRefreshTokens);
  }

  register = async (req: Req, res: Res, next: Next): Promise<void> => {
    const body: CreateUserDto = req.body;

    try {
      const { user } = await this._authSrv.register(body);
      const jsonResponse: JsonHttpResponse<User> = {
        status: 200,
        message: "Registration succeed",
        data: user
      }
      res.send(jsonResponse);
    } catch (error) {
      next(new INTERNAL_SERVER_EXCEPTION());
    }
  }

  login = async (req: Req, res: Res, next: Next): Promise<void> => {
    const body: AuthDto = { ...req.body, ipAddress: req.ip };

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
      next(new WRONG_CREDENTIALS_EXCEPTION());
    }
  }

  refreshToken = async (req: Req, res: Res, next: Next): Promise<void> => {
    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;

    try {
      const { accessToken, refreshToken } = await this._authSrv.refreshToken({ token, ipAddress });
      this.setRefreshTokenCookie(res, refreshToken);
      res.json(<JsonHttpResponse<AuthResponse>>{
        status: 200,
        message: 'Refresh token succeed',
        data: { accessToken, refreshToken }
      });
    } catch (error) {
      next(new INTERNAL_SERVER_EXCEPTION());
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
      next(new INTERNAL_SERVER_EXCEPTION(error));
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

      res.json(<JsonHttpResponse<any>>{
        status: 200,
        message: 'All tokens revoked'
      });
    } catch (error) {
      next(new INTERNAL_SERVER_EXCEPTION())
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
      next(new NOT_FOUND_EXCEPTION());
    }
  }

  updateUserPassword = async (req: RequestUser, res: Res, next: Next): Promise<void> => {
    try {
      const updatedUser = await this._authSrv.updateUserPassword({
        userId: req.user._id,
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword
      });
      res.json(<JsonHttpResponse<User>> {
        status: 200,
        message: "Update user's password succeed",
        data: updatedUser
      })
    } catch (error) {
      next(new INTERNAL_SERVER_EXCEPTION());
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
      next(new INTERNAL_SERVER_EXCEPTION())
    }
  }

  protected setRefreshTokenCookie(res: Res, refreshToken: Buffer) {
    const options: CookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    res.cookie('refreshToken', refreshToken, options);
  }
}