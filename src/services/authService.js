import User from '../model/user.js';
import { comparePassword } from '../utils/hash.js';
import { signToken } from '../utils/jwt.js';

export const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Email not found');

  const match = await comparePassword(password, user.password);
  if (!match) throw new Error('Invalid password');

  const token = signToken({id:user.id})

  return token;
};
