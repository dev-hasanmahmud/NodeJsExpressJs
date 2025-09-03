const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const path = require("path");

const { sendMail } = require("../utils/mailer");
const { signToken, verifyToken } = require("../utils/token");

// Temporary in-memory token blacklist (use Redis in production)
const tokenBlacklist = [];

/**
 * Register new user
 */
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashedPassword, isVerified: false });

    // Generate email verification token
    const verifyToken = signToken({ id: user.id }, process.env.JWT_EXPIRES_IN || "1d");
    const verifyUrl = `${process.env.APP_URL}/api/v1/auth/verify-email/${verifyToken}`;

    // Send verification email
    await sendMail({
      to: user.email,
      subject: "Verify your email",
      template: "verify-email",
      context: { name: user.name, verifyUrl },
    });

    res.status(201).json({ message: "Registration successful. Check email to verify." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

/**
 * Verify email
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(400).json({ error: "Invalid token" });

    user.isVerified = true;
    await user.save();

    // Notify new user registration (optional)
    await sendMail({
      to: user.email,
      subject: "Registration successful",
      template: "new-user-registered",
      context: { name: user.name },
    });

    res.json({ message: "Email verified successfully. You can now login." });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    if (!user.isVerified) return res.status(403).json({ error: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = signToken({ id: user.id });

    const { id, name, avatar, bio } = user;
    res.json({ token, user: { id, name, email, avatar, bio } });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

/**
 * Logout user (invalidate token)
 */
exports.logout = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) tokenBlacklist.push(token);

  res.json({ message: "Logged out successfully" });
};

/**
 * Profile
 */
exports.profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ["password"] } });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

/**
 * Update profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.file) user.avatar = `/uploads/avatars/${req.file.filename}`;
    if (req.body.name) user.name = req.body.name;
    if (req.body.bio) user.bio = req.body.bio;

    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

/**
 * Change password (authenticated)
 */
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Forgot password
 */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const resetToken = signToken({ id: user.id }, process.env.JWT_EXPIRES_IN || "1h");
    const resetUrl = `${process.env.APP_URL}/api/v1/auth/reset-password/${resetToken}`;

    await sendMail({
      to: user.email,
      subject: "Reset your password",
      template: "reset-password",
      context: { name: user.name, resetUrl },
    });

    res.json({ message: "Password reset email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Reset password
 */
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Notify user password reset success
    await sendMail({
      to: user.email,
      subject: "Password reset successful",
      template: "password-reset-success",
      context: { name: user.name },
    });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

/**
 * Middleware to check token (can be moved to separate file)
 */
exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  if (tokenBlacklist.includes(token)) {
    return res.status(401).json({ error: "Token invalidated. Please login again." });
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
