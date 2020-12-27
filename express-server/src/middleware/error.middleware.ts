import { Req, Res, Next } from '../var/types';
import { HTTP_EXCEPTION } from '../exception';

export const errorMiddleware = (err: HTTP_EXCEPTION, req: Req, res: Res, next: Next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  res.status(status).send({ status, message });
};
