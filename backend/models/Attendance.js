const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student_id: { type: String, required: true },
  student_name: { type: String, required: true },
  day_number: { type: Number, required: true },
  marked_at: { type: Date, default: Date.now },
  ip_address: { type: String },
  user_agent: { type: String }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
