const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const path = require("path");

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Handle avatar upload
    if (req.file) {
      user.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    if (req.body.bio) {
      user.bio = req.body.bio;
    }

    // Update name if provided
    if (req.body.name) {
      user.name = req.body.name;
    }

    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });

    // Exclude password from the response
    const { id, name, avatar, bio } = user;

    res.json({
      token,
      user: { id, name, email, avatar, bio },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ["password"] } });
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// logout blacklist
const tokenBlacklist = [];

exports.logout = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) tokenBlacklist.push(token);
  res.json({ message: "Logged out successfully" });
};

// Middleware to check token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  // Check blacklist
  if (tokenBlacklist.includes(token)) {
    return res.status(401).json({ error: "Token invalidated. Please login again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
