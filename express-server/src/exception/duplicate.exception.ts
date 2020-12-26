import { HTTP_EXCEPTION } from './http.exception';

export class DUPLICATE_EXCEPTION extends HTTP_EXCEPTION {
  constructor(inputValue: string) {
    super(400, `This ${inputValue} already exists`);
  }
}
