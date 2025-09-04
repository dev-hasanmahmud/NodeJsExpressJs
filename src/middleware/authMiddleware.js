const jwt = require("jsonwebtoken");

/**
 * Middleware to protect routes by verifying a JWT.
 * It provides specific error messages for different token issues.
 */
module.exports = (req, res, next) => {
  // Extract token from the Authorization header
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Invalid token format, authorization denied" });
  }

  try {
    // Verify the token using the secret key
    // The verify() method throws an error if the token is expired or invalid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user payload to the request
    next();
  } catch (err) {
    // Handle specific types of JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token." });
    }

    // Handle any other unexpected verification errors
    console.error(err);
    return res.status(401).json({ error: "Authentication failed." });
  }
};
