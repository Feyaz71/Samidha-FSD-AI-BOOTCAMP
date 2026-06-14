const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');

exports.registerStudent = async (req, res) => {
  try {
    const { full_name, email, mobile, institution_name, year_or_class } = req.body;

    if (!mobile) {
      return res.status(400).json({ error: 'Mobile Number is required.' });
    }

    // Check if student already exists via email or mobile
    let query = [];
    if (email) query.push({ email });
    if (mobile) query.push({ mobile });

    const existingStudent = await Student.findOne({ $or: query });
    if (existingStudent) {
      return res.status(400).json({ error: 'Student with this email or mobile already exists.' });
    }

    // Generate Student ID (e.g., SAM2026-001)
    const count = await Student.countDocuments();
    const nextNumber = String(count + 1).padStart(3, '0');
    const student_id = `SAM2026-${nextNumber}`;

    const newStudent = new Student({
      student_id,
      full_name,
      email,
      mobile,
      institution_name,
      year_or_class
    });

    await newStudent.save();
    res.status(201).json({ message: 'Registration successful', student_id });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStudentProfile = async (req, res) => {
  try {
    const { student_id, mobile_or_email } = req.body;

    const student = await Student.findOne({ 
      student_id, 
      $or: [{ mobile: mobile_or_email }, { email: mobile_or_email }]
    });
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found or incorrect credential.' });
    }

    const attendanceRecords = await Attendance.find({ student_id });
    const assignmentRecords = await Assignment.find({ student_id });

    // Calculate basic stats
    const totalClasses = 15; // Assume 15 for now, or fetch from Settings
    const attendancePercentage = ((attendanceRecords.length / totalClasses) * 100).toFixed(2);

    res.status(200).json({
      student,
      stats: {
        attendanceCount: attendanceRecords.length,
        attendancePercentage,
        assignmentsSubmitted: assignmentRecords.length,
      },
      attendanceRecords,
      assignmentRecords
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
