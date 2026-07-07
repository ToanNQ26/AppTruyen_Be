// utils/AppError.js
export class AppError extends Error {
  constructor(errorCode) {
    super(errorCode?.message);
    this.statusCode = errorCode?.httpStatus || 500;
    this.code = errorCode?.code || 9999;
    Error.captureStackTrace(this, this.constructor);
  }
}

