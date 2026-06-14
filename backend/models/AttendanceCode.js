const mongoose = require('mongoose');

const attendanceCodeSchema = new mongoose.Schema({
  day_number: { type: Number, required: true },
  code: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  opened_at: { type: Date, default: Date.now },
  expires_at: { type: Date, required: true }
});

module.exports = mongoose.model('AttendanceCode', attendanceCodeSchema);
