import { HTTP_EXCEPTION } from './http.exception';

export class WRONG_CREDENTIALS_EXCEPTION extends HTTP_EXCEPTION {
  constructor(public message = 'Invalid Credentials') {
    super(401, message);
  }
}