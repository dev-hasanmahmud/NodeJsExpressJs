const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Shift = sequelize.define(
  "Shift",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    startTime: { type: DataTypes.TIME, allowNull: false },
    endTime: { type: DataTypes.TIME, allowNull: false },
    breakDuration: { type: DataTypes.INTEGER, defaultValue: 0 }, // minutes
    lateGracePeriod: { type: DataTypes.INTEGER, defaultValue: 0 },
    earlyLeaveGracePeriod: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.ENUM("active", "inactive"), defaultValue: "active" },
  },
  {
    tableName: "shifts",
    timestamps: true,
  }
);

module.exports = Shift;
