const express = require("express");
const app = express();
const { sequelize } = require("./src/models");
require("dotenv").config();
const path = require("path");
const authRoutes = require("./src/routes/auth");
const employeeRoutes = require("./src/routes/employee");
// const shiftRoutes = require("./src/routes/shift");
// const attendanceRoutes = require("./src/routes/attendance");

app.use(express.json());

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Add version prefix for auth
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/employee", employeeRoutes);
// app.use("/api/v1/shift", shiftRoutes);
// app.use("/api/v1/attendance", attendanceRoutes);

// Example route
app.get("/", (req, res) => res.send("API running"));

// Sync database
sequelize.sync({ alter: true }) // or { force: true } in development
  .then(() => {
    console.log("All tables synced!");
    app.listen(process.env.PORT || 3000, () =>
      console.log(`Server running on port ${process.env.PORT || 3000}`)
    );
  })
  .catch((err) => console.error("Failed to sync database:", err));
