import { HTTP_EXCEPTION } from './http.exception';

export class DUPLICATE_EXCEPTION extends HTTP_EXCEPTION {
  constructor(message = 'Already Exists!') {
    super(400, message);
  }
}
