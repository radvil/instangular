import { HTTP_EXCEPTION } from './http.exception';

export class INTERNAL_SERVER_EXCEPTION extends HTTP_EXCEPTION {

  constructor(message?: string) {
    const _message = message ? message : `Internal Server Error`;
    super(500, _message);
  }
}
