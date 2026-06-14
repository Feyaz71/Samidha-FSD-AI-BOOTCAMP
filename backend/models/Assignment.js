const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  student_id: { type: String, required: true },
  student_name: { type: String, required: true },
  assignment_title: { type: String, required: true },
  version: { type: Number, default: 1 },
  description: { type: String },
  github_link: { type: String },
  live_link: { type: String },
  file_url: { type: String },
  mentor_feedback: { type: String },
  mentor_rating: { type: String },
  status: { type: String, enum: ['On Time', 'Late Submission'], required: true },
  submitted_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
