const Attendance = require('../models/Attendance');
const AttendanceCode = require('../models/AttendanceCode');
const Student = require('../models/Student');
const AttendanceLock = require('../models/AttendanceLock');

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

    // Verify student exists
    const student = await Student.findOne({ student_id });
    if (!student || !student.mobile.endsWith(mobile)) {
      return res.status(400).json({ error: 'Invalid Student ID or Mobile Number.' });
    }

    // Try verifying against AttendanceLock first (Test Assignment OTP)
    let isVerified = false;
    let dayNumber = null;

    const lock = await AttendanceLock.findOne({ 
      student_id, 
      otp_code: code, 
      status: 'PENDING',
      expires_at: { $gt: new Date() }
    });

    if (lock) {
      isVerified = true;
      dayNumber = 0; // Using 0 for test assignment attendances
      // Consume the lock immediately
      lock.status = 'CONSUMED';
      await lock.save();
    } else {
      // Try verifying against daily AttendanceCode
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const attendanceCode = await AttendanceCode.findOne({ 
        code, 
        is_active: true,
        createdAt: { $gte: today } 
      });

      if (attendanceCode) {
        isVerified = true;
        dayNumber = attendanceCode.day_number;
      }
    }

    if (!isVerified) {
      return res.status(400).json({ error: 'Invalid or expired code.' });
    }

    // Check if already marked for this day (unless it's a test assignment)
    if (dayNumber !== 0) {
      const alreadyMarked = await Attendance.findOne({ 
        student_id, 
        day_number: dayNumber 
      });
      if (alreadyMarked) {
        return res.status(400).json({ error: 'Attendance already marked for this day.' });
      }
    }

    const attendance = new Attendance({
      student_id,
      student_name: student.full_name,
      day_number: dayNumber,
      ip_address,
      user_agent
    });

    await attendance.save();
    res.status(200).json({ message: 'Attendance Marked Successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
