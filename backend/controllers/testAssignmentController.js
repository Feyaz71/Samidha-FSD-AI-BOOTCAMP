const TestAssignmentConfig = require('../models/TestAssignmentConfig');
const Assignment = require('../models/Assignment');
const AttendanceLock = require('../models/AttendanceLock');
const Student = require('../models/Student');

exports.getActiveTestAssignments = async (req, res) => {
  try {
    const assignments = await TestAssignmentConfig.find({ is_active: true }).sort({ created_at: -1 });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.submitTestAssignment = async (req, res) => {
  try {
    const { student_id, assignment_title, description, github_link, live_link, file_url } = req.body;

    const student = await Student.findOne({ student_id });
    if (!student) {
      return res.status(400).json({ error: 'Invalid Student ID.' });
    }

    const config = await TestAssignmentConfig.findOne({ title: assignment_title, is_active: true });
    if (!config) {
      return res.status(400).json({ error: 'Invalid Test Assignment.' });
    }

    // Check if within time bound
    const startTime = new Date(config.start_time).getTime();
    const endTime = startTime + (config.duration_hours * 60 * 60 * 1000);
    const now = Date.now();

    let isLate = false;
    if (now > endTime || now < startTime) {
      isLate = true;
    }

    const previousSubmissions = await Assignment.countDocuments({ student_id, assignment_title });
    const version = previousSubmissions + 1;

    const assignment = new Assignment({
      student_id,
      student_name: student.full_name,
      assignment_title,
      version,
      description,
      github_link,
      live_link,
      file_url,
      status: isLate ? 'Late Submission' : 'On Time'
    });
    await assignment.save();

    if (isLate) {
      return res.status(200).json({ 
        message: 'Assignment submitted late. No attendance OTP generated.', 
        success: true,
        has_otp: false
      });
    }

    // Queue logic for On Time submission
    // We will poll until no PENDING lock exists
    let lockAcquired = false;
    let attempts = 0;
    while (!lockAcquired && attempts < 60) { // Wait max 120 seconds
      const existingLock = await AttendanceLock.findOne({ status: 'PENDING', expires_at: { $gt: new Date() } });
      if (!existingLock) {
        lockAcquired = true;
        break;
      }
      await new Promise(r => setTimeout(r, 2000));
      attempts++;
    }

    if (!lockAcquired) {
       return res.status(503).json({ error: 'Server too busy handling other attendances. Please try submitting again.' });
    }

    // Acquire lock and generate OTP
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 mins from now
    
    const newLock = new AttendanceLock({
      student_id,
      otp_code: otp,
      expires_at: expiresAt,
      status: 'PENDING'
    });
    await newLock.save();

    res.status(200).json({ 
      message: 'Test Assignment submitted on time. Please mark attendance immediately.', 
      success: true,
      has_otp: true,
      otp: otp,
      expires_at: expiresAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
