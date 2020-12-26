import { HTTP_EXCEPTION } from './http.exception';

export class BAD_REQUEST_EXCEPTION extends HTTP_EXCEPTION {
  constructor(_message?: string) {
    const message = _message ? _message : 'Bad Request';
    super(400, message);
  }
}
