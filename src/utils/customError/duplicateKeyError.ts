export class DuplicateKeyError extends Error {
  statusCode = 409;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, DuplicateKeyError.prototype);
  }
}
