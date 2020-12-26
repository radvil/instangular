import { HTTP_EXCEPTION } from './http.exception';

export class UNAUTHORIZED_EXCEPTION extends HTTP_EXCEPTION {
  constructor(message = 'Unauthorized!', statusCode = 403) {
    super(statusCode, message);
  }
}