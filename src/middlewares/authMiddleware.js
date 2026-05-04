import jwt from 'jsonwebtoken';
import { ErrorCode } from '../utils/exeption/ErrorCode.js';
import { AppError } from '../utils/exeption/AppError.js';


export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError(ErrorCode.UNAUTHENTICATED));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
     if (err.name === 'TokenExpiredError') {
      return next(new AppError(ErrorCode.TOKEN_EXPIRED));
    }
    return next(new AppError(ErrorCode.INVALID_KEY));
  }
};
