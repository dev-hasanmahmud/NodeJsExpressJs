const { Op } = require("sequelize");
const moment = require("moment");
const Attendance = require("../models/Attendance");
const Shift = require("../models/Shift");
const Employee = require("../models/Employee");
const { summarizeAttendance } = require("../services/summarizeAttendance");

/**
 * Employee Check-In
 */
exports.checkIn = async (req, res) => {
  const { employee_id, shift_id, at } = req.body;

  try {
    const checkInTime = at ? moment(at) : moment();

    // Prevent double check-in
    const existing = await Attendance.findOne({
      where: { employee_id, check_out: null }
    });
    if (existing) {
      return res.status(400).json({ error: "Already checked in. Please check out first." });
    }

    const attendance = await Attendance.create({
      employee_id,
      shift_id,
      check_in: checkInTime.toDate()
    });

    res.status(201).json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during check-in" });
  }
};

/**
 * Employee Check-Out
 */
exports.checkOut = async (req, res) => {
  const { employee_id, at } = req.body;

  try {
    const checkOutTime = at ? moment(at) : moment();

    const attendance = await Attendance.findOne({
      where: { employee_id, check_out: null },
      include: [{ model: Shift }]
    });

    if (!attendance) {
      return res.status(400).json({ error: "No active check-in found." });
    }

    attendance.check_out = checkOutTime.toDate();
    await attendance.save();

    // Summarize attendance (late/early/worked_hours)
    const summary = summarizeAttendance(attendance, attendance.Shift);

    res.json({ ...attendance.toJSON(), summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during check-out" });
  }
};

/**
 * Break-In
 */
exports.breakIn = async (req, res) => {
  const { employee_id, at } = req.body;

  try {
    const attendance = await Attendance.findOne({
      where: { employee_id, check_out: null }
    });
    if (!attendance) {
      return res.status(400).json({ error: "No active check-in found." });
    }

    attendance.break_in = at ? moment(at).toDate() : new Date();
    await attendance.save();

    res.json({ message: "Break started", attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during break-in" });
  }
};

/**
 * Break-Out
 */
exports.breakOut = async (req, res) => {
  const { employee_id, at } = req.body;

  try {
    const attendance = await Attendance.findOne({
      where: { employee_id, check_out: null }
    });
    if (!attendance || !attendance.break_in) {
      return res.status(400).json({ error: "No active break found." });
    }

    const breakOut = at ? moment(at) : moment();
    const breakMinutes = breakOut.diff(moment(attendance.break_in), "minutes");

    attendance.break_minutes = (attendance.break_minutes || 0) + breakMinutes;
    attendance.break_in = null; // reset break_in
    await attendance.save();

    res.json({ message: "Break ended", breakMinutes, attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during break-out" });
  }
};

/**
 * Employee Attendance Report
 */
exports.employeeReport = async (req, res) => {
  const { employeeId } = req.params;
  const { from, to } = req.query;

  try {
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const attendances = await Attendance.findAll({
      where: {
        employee_id: employeeId,
        check_in: {
          [Op.between]: [from, to]
        }
      },
      include: [{ model: Shift }],
      order: [["check_in", "DESC"]]
    });

    const report = attendances.map((a) => summarizeAttendance(a, a.Shift));

    res.json({
      employee: {
        id: employee.id,
        name: employee.name,
        employee_no: employee.employee_no,
        department: employee.department
      },
      from,
      to,
      attendances: report
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error generating report" });
  }
};
