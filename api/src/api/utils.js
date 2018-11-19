class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = status;
    this.payload = { msg: message };
  }
}

class NotFound extends AppError {
  constructor() {
    super('', 404);
    this.payload = null;
  }
}

export { AppError, NotFound };
