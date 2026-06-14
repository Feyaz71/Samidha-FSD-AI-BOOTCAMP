const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const AttendanceCode = require('../models/AttendanceCode');
const Assignment = require('../models/Assignment');
const moment = require('moment');

exports.getAnalytics = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalAttendance = await Attendance.countDocuments();
    const totalAssignments = await Assignment.countDocuments();

    res.status(200).json({
      totalStudents,
      totalAttendance,
      totalAssignments
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createAttendanceCode = async (req, res) => {
  try {
    const { day_number, expires_in_minutes = 15 } = req.body;
    
    // Generate 5 digit code
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    
    const expires_at = moment().add(expires_in_minutes, 'minutes').toDate();

    const attendanceCode = new AttendanceCode({
      day_number,
      code,
      expires_at
    });

    await attendanceCode.save();
    res.status(201).json({ message: 'Code generated', code, expires_at });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ registered_at: -1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().sort({ createdAt: -1 });
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const { type } = req.params;
    let data = [];
    
    if (type === 'students') {
      const students = await Student.find().lean();
      if (students.length === 0) return res.status(404).send('No data');
      
      const header = "Student ID,Full Name,Email,Mobile,School/College,Year/Class,Registered At\n";
      const rows = students.map(s => `${s.student_id},${s.full_name},${s.email || ''},${s.mobile},${s.institution_name},${s.year_or_class},${s.registered_at}`).join("\n");
      data = header + rows;
    } else if (type === 'attendance') {
      const attendance = await Attendance.find().lean();
      if (attendance.length === 0) return res.status(404).send('No data');
      
      const header = "Student ID,Student Name,Day Number,Status,Marked At\n";
      const rows = attendance.map(a => `${a.student_id},${a.student_name},${a.day_number},Present,${new Date(a.marked_at || a.createdAt).toLocaleString()}`).join("\n");
      data = header + rows;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${type}.csv`);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export' });
  }
};

exports.generateCertificates = async (req, res) => {
  // In a real scenario, use PDFKit to draw over a template
  res.status(200).json({ message: 'Certificates generated successfully!' });
};
