import { HTTP_EXCEPTION } from './http.exception';

export class UNAUTHORIZED_EXCEPTION extends HTTP_EXCEPTION {
  constructor() {
    super(403, 'Unauthorized!');
  }
}