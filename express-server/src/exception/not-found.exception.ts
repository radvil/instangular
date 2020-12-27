import { HTTP_EXCEPTION } from './http.exception';

export class NOT_FOUND_EXCEPTION extends HTTP_EXCEPTION {
  constructor(message = `Not found!`) {
    super(404, message);
  }
}