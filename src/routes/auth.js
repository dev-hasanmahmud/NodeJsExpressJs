const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const upload = require("../utils/upload")("avatars");
const authMiddleware = require("../middleware/authMiddleware");
const { registerValidator, loginValidator } = require("../validators/authValidator");

router.post("/register", registerValidator, authController.register);
router.post("/login", loginValidator, authController.login);
router.get("/profile", authMiddleware, authController.profile);
router.put("/profile", authMiddleware, upload.single("avatar"), authController.updateProfile);
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;
