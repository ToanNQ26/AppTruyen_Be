import asyncHandler from "../utils/method/asyncHandler.js";
import * as authService from '../services/authService.js';

export const login = asyncHandler(async (req, res) => {
  try {
  const { email, password } = req.body;
  console.log(req.body);
  const token = await authService.login(email, password);
  res.json({ token });
  } catch (err) {
    console.error(err);  // <--- dán ở đây để in ra lỗi chi tiết
    res.status(500).json({ message: "Internal server error" });
  }
});
