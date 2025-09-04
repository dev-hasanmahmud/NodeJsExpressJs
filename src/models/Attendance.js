const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Employee = require("./Employee");
const Shift = require("./Shift");

const Attendance = sequelize.define(
  "Attendance",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    checkIn: { type: DataTypes.DATE, allowNull: false },
    checkOut: { type: DataTypes.DATE },
    breakIn: { type: DataTypes.DATE },
    breakOut: { type: DataTypes.DATE },
  },
  {
    tableName: "attendances",
    timestamps: true,
  }
);

Attendance.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });
Attendance.belongsTo(Shift, { foreignKey: "shiftId", as: "shift" });

module.exports = Attendance;
