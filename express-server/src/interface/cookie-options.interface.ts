import { CookieOptions as OriginalCookieOptions } from 'express';

export interface CookieOptions extends OriginalCookieOptions {
  JWT: string;
}