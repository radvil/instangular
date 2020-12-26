import { HTTP_EXCEPTION } from './http.exception';

export class NOT_FOUND_EXCEPTION extends HTTP_EXCEPTION {
  constructor(uid?: string) {
    const message = uid 
    ? `${uid} is not found!`
    : `Not found!`;

    super(404, message);
  }
}