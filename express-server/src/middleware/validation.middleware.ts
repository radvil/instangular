import { RequestHandler } from 'express';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

import { BAD_REQUEST_EXCEPTION } from '../exception';
import { Req, Res, Next } from '../var/types';

export function validationMiddleware<T>(type: any, skipMissingProperties = false): RequestHandler {
  return (req: Req, res: Res, next: Next) => {
    validate(plainToClass(type, req.body as T), { skipMissingProperties })
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
          next(new BAD_REQUEST_EXCEPTION(message));
        } else {
          next();
        }
      })
  }
}