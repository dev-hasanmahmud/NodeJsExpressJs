const express = require("express");
const router = express.Router();
const shiftController = require("../controllers/shiftController");
const shiftValidator = require("../validators/shiftValidator");
const authMiddleware = require("../middleware/authMiddleware");

// Shifts
router.get("/", authMiddleware, shiftController.list);
router.post("/", authMiddleware, shiftValidator.create, shiftController.create);
router.get("/:id", authMiddleware, shiftController.getOne);
router.put("/:id", authMiddleware, shiftValidator.update, shiftController.update);
router.delete("/:id", authMiddleware, shiftController.remove);

module.exports = router;
