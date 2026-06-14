const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  minimum_attendance_percentage: { type: Number, default: 75 },
  minimum_assignments: { type: Number, default: 3 },
  bootcamp_start_date: { type: Date, required: true }
});

module.exports = mongoose.model('Settings', settingsSchema);
