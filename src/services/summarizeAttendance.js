const moment = require("moment");

function summarizeAttendance(attendance, shift) {
  const checkIn = moment(attendance.check_in);
  const checkOut = moment(attendance.check_out);

  const shiftStart = moment(checkIn).set({
    hour: shift.start_time.split(":")[0],
    minute: shift.start_time.split(":")[1]
  });

  const shiftEnd = moment(checkIn).set({
    hour: shift.end_time.split(":")[0],
    minute: shift.end_time.split(":")[1]
  });

  const lateThreshold = shiftStart.clone().add(shift.late_grace_period || 0, "minutes");
  const isLate = checkIn.isAfter(lateThreshold);

  const earlyThreshold = shiftEnd.clone().subtract(shift.early_leave_grace_period || 0, "minutes");
  const isEarlyLeave = checkOut.isBefore(earlyThreshold);

  const workedMinutes = checkOut.diff(checkIn, "minutes") - (attendance.break_minutes || 0);
  const workedHours = (workedMinutes / 60).toFixed(2);

  let status = "Present";
  if (isLate && isEarlyLeave) status = "Late & Early Leave";
  else if (isLate) status = "Late";
  else if (isEarlyLeave) status = "Early Leave";

  return {
    date: checkIn.format("YYYY-MM-DD"),
    check_in: checkIn.format("YYYY-MM-DD HH:mm:ss"),
    check_out: checkOut.format("YYYY-MM-DD HH:mm:ss"),
    worked_hours: workedHours,
    status
  };
}

module.exports = { summarizeAttendance };
