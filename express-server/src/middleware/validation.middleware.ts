import { RequestHandler } from 'express';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

import { HTTP_EXCEPTION } from '../exception';
import { Req, Res, Next } from '../var/types';

export function validationMiddleware<T>(type: any, skipMissingProperties = false): RequestHandler {
  return (req: Req, res: Res, next: Next) => {
    validate(plainToClass(type, req.body), { skipMissingProperties })
      .then((errors: ValidationError[]) => {

        if (errors.length > 0) {
          const message = errors.map((error: ValidationError | any) => Object.values(error.constraints)).join(', ');
          next(new HTTP_EXCEPTION(400, message));
          
        } else {
          next();
        }
      })
  }
}