import User from '../model/User.js';
import { signToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { AppError } from '../utils/exeption/AppError.js';
import { ErrorCode } from '../utils/exeption/ErrorCode.js';
import RefreshToken from '../model/RefreshToken.js';
import { compare,hashToken  } from '../utils/hash.js';
import { verifyGoogleCredential } from "../utils/google.js";

export const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(ErrorCode.USER_NOT_EXISTED);

  const match = await compare(password, user.password);
  if (!match) throw new AppError(ErrorCode.PASSWORD_INCORRECT);

  const token = signToken({id:user.id, role: user.role});
  let refreshtoken = signRefreshToken({id:user.id, role: user.role})
  let refreshhashed =  hashToken(refreshtoken)
  await RefreshToken.create({
      userId: user._id,
      token: refreshhashed,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  return {
    accessToken: token,
    refreshToken: refreshtoken,
  };
};

export const refresh = async (refreshToken) => {
  if(!refreshToken) {
    throw new AppError(ErrorCode.TOKEN_NOT_EXIST);
  }
  let payload;

  try {
      payload = verifyRefreshToken(refreshToken);
  } catch (err) {

      if (err.name === 'TokenExpiredError') {
          throw new AppError(ErrorCode.REFRESH_TOKEN_EXPIRED);
      }

      throw new AppError(ErrorCode.INVALID_KEY);
  }

  const tokenHash = hashToken(refreshToken);

  const tokenDoc = await RefreshToken.findOne({
    token: tokenHash
});
  if(!tokenDoc) {
    throw new AppError(ErrorCode.UNAUTHENTICATED)
  }

  const user = await User.findById(payload.id);
  if (!user) {
    throw new AppError(ErrorCode.USER_NOT_EXISTED);
}
  const accessToken = signToken({
    id: user.id,
    role: user.role
    });
  
  let newRefreshToken = signRefreshToken({id:user.id, role: user.role})
  let refreshhashed =  hashToken(newRefreshToken)
  await RefreshToken.findOneAndUpdate({token: tokenHash},{token : refreshhashed});

  return {accessToken,refreshtoken: newRefreshToken};
}

export const logout = async (refreshToken) => {
    // Kiểm tra token hợp lệ
    verifyRefreshToken(refreshToken);

    const tokenHash = hashToken(refreshToken);

    const deleted = await RefreshToken.findOneAndDelete({
        token: tokenHash,
    });

    if (!deleted) {
        throw new AppError(ErrorCode.UNAUTHENTICATED);
    }
};



export const googleLogin = async (credential) => {
    const payload = await verifyGoogleCredential(credential);

    if (!payload.email_verified) {
        throw new AppError("Google email is not verified", 401);
    }

    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            email: email,
            name: name,
            googleId: sub,
            role: 'user',
            password: '1111111',
        });
    }

    const accessToken = signToken({id:user.id, role: user.role});
    let refreshtoken = signRefreshToken({id:user.id, role: user.role})
    let refreshhashed =  hashToken(refreshtoken)
    await RefreshToken.create({
        userId: user._id,
        token: refreshhashed,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    return {
        accessToken,
        refreshToken : refreshtoken,
        user,
    };
};