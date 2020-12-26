import { CookieOptions, Router } from 'express';
import { sign as jwtSign, Secret } from 'jsonwebtoken';

import { INTERNAL_SERVER_EXCEPTION, WRONG_CREDENTIALS_EXCEPTION } from '../exception';
import { Controller, TokenPayload, JwtData, JsonHttpResponse } from '../interface';
import { validationMiddleware } from '../middleware';
import { CreateUserDto, User } from '../user';
import { Req, Res, Next } from '../var/types';
import { AuthResponse, AuthService, } from './auth.service';
import { LogInDto } from './login.dto';

export class AuthController implements Controller {
  public path = '/auth';
  public router = Router();
  private _authSrv = new AuthService();

  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post(`${this.path}/register`, validationMiddleware<CreateUserDto>(CreateUserDto), this.register);
    this.router.post(`${this.path}/login`, validationMiddleware<LogInDto>(LogInDto), this.login);
    this.router.post(`${this.path}/logout`, this.logout);
  }

  private register = async (req: Req, res: Res, next: Next): Promise<void> => {
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

  private login = async (req: Req, res: Res, next: Next): Promise<void> => {
    const body: LogInDto = { ...req.body, ipAddress: req.ip };

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

  public logout = (req: Req, res: Res): void => {
    this.setRefreshTokenCookie(res, null);
    res.sendStatus(200);
  }

  private setRefreshTokenCookie(res: Res, refreshToken: string) {
    const options: CookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    res.cookie('refreshToken', refreshToken, options);
  }
}