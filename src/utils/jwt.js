import jwt from 'jsonwebtoken';

/**
 * Sinh access‑token
 * @param {Object} payload – dữ liệu muốn nhúng (vd. { id })
 * @param {String} [expires='3h'] – thời hạn token (3h)
 * @returns {String} token
 */
export const signToken = (payload, expires = '3h') =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expires });

