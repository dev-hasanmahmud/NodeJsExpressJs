const sequelize = require("../config/db");
const User = require("./User");
const Employee = require("./Employee");
const Shift = require("./Shift");
const Attendance = require("./Attendance");

// Define associations
Employee.hasMany(Attendance, { foreignKey: "employee_id" });
Attendance.belongsTo(Employee, { foreignKey: "employee_id" });

Shift.hasMany(Attendance, { foreignKey: "shift_id" });
Attendance.belongsTo(Shift, { foreignKey: "shift_id" });

module.exports = {
  sequelize,
  User,
  Employee,
  Shift,
  Attendance,
};
