import User from '../model/User.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { comparePassword } from '../utils/hash.js';
import { signToken } from '../utils/jwt.js';
import { AppError } from '../utils/exeption/AppError.js';
import { ErrorCode } from '../utils/exeption/ErrorCode.js';

export const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(ErrorCode.USER_NOT_EXISTED);

  const match = await comparePassword(password, user.password);
  if (!match) throw new AppError(ErrorCode.PASSWORD_INCORRECT);

  const token = signToken({id:user.id, role: user.role});

  return token;
};
