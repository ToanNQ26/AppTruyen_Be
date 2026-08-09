// src/utils/hash.js
import bcrypt from 'bcryptjs';
import { createHash } from "crypto";

export const hash = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, 10);
};

export const compare = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed);
};

export const hashToken = (token) => {
  return createHash("sha256")
    .update(token)
    .digest("hex");
};

export const compareToken = (
  token,
  hashedToken
) => {
  return hashToken(token) === hashedToken;
};