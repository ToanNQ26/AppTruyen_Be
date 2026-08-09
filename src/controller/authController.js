import asyncHandler from "../utils/method/asyncHandler.js";
import * as authService from '../services/authService.js';
import { ApiResponse } from "../utils/apiResponse.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken } = await authService.login(email, password);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json(new ApiResponse({
    result: { accessToken },
  }));
});


export const refeshverify = async(req,res) => {
  const refreshToken = req.cookies.refreshToken;
  const { accessToken, refreshtoken: newRefreshToken  } = await authService.refresh(refreshToken);
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

    return res.json(
      new ApiResponse({
          result: {
              accessToken
          },
      })
    );
}

export const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    await authService.logout(refreshToken);

    res.clearCookie("refreshToken");

    return res.json(
        new ApiResponse({
            message: "Logout successfully",
        })
    );
});

export const googleLogin = asyncHandler(async (req, res) => {
    const { credential } = req.body;

    const { accessToken, refreshToken, user } = await authService.googleLogin(credential);

    res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

    return res.json(
      new ApiResponse({
          result: {
              accessToken
          },
      })
    );
});