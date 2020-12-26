import { Router } from 'express';
import { sign as jwtSign, Secret } from 'jsonwebtoken';

import { INTERNAL_SERVER_EXCEPTION, WRONG_CREDENTIALS_EXCEPTION } from '../exception';
import { Controller, TokenPayload, JwtData } from '../interface';
import { validationMiddleware } from '../middleware';
import { CreateUserDto, User } from '../user';
import { Req, Res, Next } from '../var/types';
import { AuthService } from './auth.service';
import { LogInDto } from './login.dto';

export class AuthController implements Controller {
  public path = '/auth';
  public router = Router();
  public _authSrv = new AuthService();

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
      const { token, expiresIn }: JwtData = this.createToken(user);

      this.setAuthCookie(res, token, expiresIn);
      res.send(user);
    } catch (error) {
      next(new INTERNAL_SERVER_EXCEPTION());
    }
  }

  private login = async (req: Req, res: Res, next: Next) => {
    const body: LogInDto = req.body;

    try {
      const { user } = await this._authSrv.login(body);
      const { token, expiresIn }: JwtData = this.createToken(user);

      this.setAuthCookie(res, token, expiresIn);
      res.json(user);
    } catch (error) {
      next(new WRONG_CREDENTIALS_EXCEPTION());
    }
  }

  public logout = (req: Req, res: Res): void => {
    this.setAuthCookie(res, null, 0);
    res.sendStatus(200);
  }

  private createToken(user: User): JwtData {
    const expiresIn = 3600;
    const secret = process.env.JWT_SECRET as Secret;
    const payload: TokenPayload = { _id: user._id };
    const token = jwtSign(payload, secret, { expiresIn });

    return { token, expiresIn };
  }

  private setAuthCookie(res: Res, token: Secret, expiresIn: number): void {
    res.cookie('JWT', token, { maxAge: expiresIn, httpOnly: true });
  }
}