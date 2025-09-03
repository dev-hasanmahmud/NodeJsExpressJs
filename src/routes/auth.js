const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const upload = require("../utils/upload")("avatars");
const authMiddleware = require("../middleware/authMiddleware");
const { registerValidator, loginValidator } = require("../validators/authValidator");

// 🔐 Auth routes
router.post("/register", registerValidator, authController.register);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/login", loginValidator, authController.login);
router.post("/logout", authMiddleware, authController.logout);

// 👤 Profile routes
router.get("/profile", authMiddleware, authController.profile);
router.put("/profile", authMiddleware, upload.single("avatar"), authController.updateProfile);

// 🔑 Password management
router.put("/change-password", authMiddleware, authController.changePassword);

// 📧 Password reset flow
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
