export class HTTP_EXCEPTION extends Error {
  constructor(public status: number, public message: string) {
    super(message);
  }
}