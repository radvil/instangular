import { HTTP_EXCEPTION } from './http.exception';

export class WRONG_CREDENTIALS_EXCEPTION extends HTTP_EXCEPTION {
  constructor() {
    super(401, 'Invalid Credentials');
  }
}