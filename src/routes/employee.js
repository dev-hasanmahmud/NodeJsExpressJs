const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const employeeValidator = require("../validators/employeeValidator");
const authMiddleware = require("../middleware/authMiddleware");

// Create employee
router.post("/", authMiddleware, employeeValidator.create, employeeController.create);

// Update employee
router.put("/:id", authMiddleware, employeeValidator.update, employeeController.update);

// Get all employees
router.get("/", authMiddleware, employeeController.getAll);

// Get one employee
router.get("/:id", authMiddleware, employeeController.getById);

// Delete employee
router.delete("/:id", authMiddleware, employeeController.remove);

module.exports = router;
