const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Employee = sequelize.define(
  "Employee",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeNo: { type: DataTypes.STRING, unique: true, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true },
    phone: { type: DataTypes.STRING, unique: true },
    department: { type: DataTypes.STRING },
    designation: { type: DataTypes.STRING },
    joinDate: { type: DataTypes.DATE },
    status: { type: DataTypes.ENUM("active", "inactive"), defaultValue: "active" },
  },
  {
    tableName: "employees",
    timestamps: true,
  }
);

module.exports = Employee;
