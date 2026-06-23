const mongoose = require('mongoose');

const testAssignmentConfigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  start_time: { type: Date, required: true },
  duration_hours: { type: Number, required: true },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestAssignmentConfig', testAssignmentConfigSchema);
