const Attendance = require('../models/Attendance');
const AttendanceCode = require('../models/AttendanceCode');
const Student = require('../models/Student');

exports.getAttendanceStatus = async (req, res) => {
  try {
    const activeCode = await AttendanceCode.findOne({ is_active: true, expires_at: { $gt: new Date() } });
    if (activeCode) {
      res.status(200).json({ status: 'OPEN' });
    } else {
      res.status(200).json({ status: 'CLOSED' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { student_id, mobile, code } = req.body;
    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.headers['user-agent'];

    // Validate Student
    const student = await Student.findOne({ student_id });
    if (!student || !student.mobile.endsWith(mobile)) {
      return res.status(400).json({ error: 'Invalid Student ID or Mobile Number.' });
    }

    // Validate Code
    const activeCode = await AttendanceCode.findOne({ code, is_active: true });
    if (!activeCode) {
      return res.status(400).json({ error: 'Invalid Attendance Code.' });
    }
    if (new Date() > activeCode.expires_at) {
      activeCode.is_active = false;
      await activeCode.save();
      return res.status(400).json({ error: 'Attendance Code has expired.' });
    }

    // Check duplicate
    const existing = await Attendance.findOne({ student_id, day_number: activeCode.day_number });
    if (existing) {
      return res.status(400).json({ error: 'Attendance already marked for today.' });
    }

    const attendance = new Attendance({
      student_id,
      student_name: student.full_name,
      day_number: activeCode.day_number,
      ip_address,
      user_agent
    });

    await attendance.save();
    res.status(200).json({ message: 'Attendance Marked Successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
