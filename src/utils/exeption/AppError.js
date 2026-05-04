// utils/AppError.js
export class AppError extends Error {
  constructor(errorCode) {
    super(errorCode.message);
    this.statusCode = 400;
    this.errorCode = errorCode;
    this.code = errorCode.code;
    Error.captureStackTrace(this, this.constructor);
  }
}

