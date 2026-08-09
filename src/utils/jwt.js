import jwt from 'jsonwebtoken';

/**
 * Sinh access‑token
 * @param {Object} payload – dữ liệu muốn nhúng (vd. { id })
 * @param {String} [expires='3h'] – thời hạn token (3h)
 * @returns {String} token
 */
export const signToken = (payload, expires = '3h') =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expires });

/**
 * Sinh refresh‑token
 * @param {Object} payload – dữ liệu muốn nhúng (vd. { id })
 * @param {String} [expires='7d'] – thời hạn token (7d)
 * @returns {String} token
 */
export const signRefreshToken = (payload, expires = '7d') => 
  jwt.sign(payload, process.env.JWT_REFRESH, { expiresIn: expires});


export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH);
}