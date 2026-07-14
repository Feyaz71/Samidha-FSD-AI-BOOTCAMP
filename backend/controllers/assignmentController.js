const Assignment = require('../models/Assignment');
const AssignmentConfig = require('../models/AssignmentConfig');
const Student = require('../models/Student');

exports.getActiveAssignments = async (req, res) => {
  try {
    const assignments = await AssignmentConfig.find({ is_active: true }).sort({ created_at: -1 }).lean();
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.submitAssignment = async (req, res) => {
  try {
    const { student_id, assignment_title, description, github_link, live_link, file_url } = req.body;

    const student = await Student.findOne({ student_id }).lean();
    if (!student) {
      return res.status(400).json({ error: 'Invalid Student ID.' });
    }

    const config = await AssignmentConfig.findOne({ title: assignment_title, is_active: true }).lean();
    let status = 'On Time';
    if (config && new Date() > config.deadline) {
      status = 'Late Submission';
    }

    // Versioning
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
      status
    });

    await assignment.save();
    res.status(200).json({ message: `Assignment submitted successfully! (Version ${version})` });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
