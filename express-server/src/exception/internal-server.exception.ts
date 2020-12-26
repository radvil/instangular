import { HTTP_EXCEPTION } from './http.exception';

export class INTERNAL_SERVER_EXCEPTION extends HTTP_EXCEPTION {

  constructor(message = 'Internal Server Error') {
    if (typeof(message) === 'object') message = 'Internal Server Error';
    super(500, message);
  }
}
