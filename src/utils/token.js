const jwt = require("jsonwebtoken");

/**
 * Sign a JWT token
 * @param {Object} payload - Data to encode
 * @param {string} [expiresIn] - Token expiry (overrides default)
 * @returns {string} JWT token
 */
exports.signToken = (payload, expiresIn) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn || process.env.JWT_EXPIRES_IN || "1h",
  });
};

/**
 * Verify a JWT token
 * @param {string} token
 * @returns {Object} Decoded payload
 * @throws Error if invalid or expired
 */
exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Decode a JWT token without verification (optional)
 * @param {string} token
 * @returns {Object} Decoded payload
 */
exports.decodeToken = (token) => {
  return jwt.decode(token);
};
