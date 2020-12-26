import { Request } from 'express';
import { TokenOwner } from '../auth';

export interface RequestUser extends Request {
  user: TokenOwner;
}