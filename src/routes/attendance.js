const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const attendanceController = require("../controllers/attendanceController");

router.post("/check-in", authMiddleware, attendanceController.checkIn);
router.post("/check-out", authMiddleware, attendanceController.checkOut);
router.post("/break-in", authMiddleware, attendanceController.breakIn);
router.post("/break-out", authMiddleware, attendanceController.breakOut);

router.get("/reports/employees/:employeeId", authMiddleware, attendanceController.employeeReport);

module.exports = router;
