import { Request } from 'express';
import { AuthUser } from '../auth';

export interface RequestUser extends Request {
  user: AuthUser;
}