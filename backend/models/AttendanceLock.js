const mongoose = require('mongoose');

const attendanceLockSchema = new mongoose.Schema({
  student_id: { type: String, required: true },
  otp_code: { type: String, required: true },
  expires_at: { type: Date, required: true },
  status: { type: String, enum: ['PENDING', 'CONSUMED'], default: 'PENDING' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AttendanceLock', attendanceLockSchema);
