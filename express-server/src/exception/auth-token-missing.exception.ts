import { HTTP_EXCEPTION } from './http.exception';

export class AUTH_TOKEN_MISSING_EXCEPTION extends HTTP_EXCEPTION {
  constructor() {
    super(403, 'No Token Provided!');
  }
}