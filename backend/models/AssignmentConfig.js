const mongoose = require('mongoose');

const assignmentConfigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  deadline: { type: Date, required: true },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AssignmentConfig', assignmentConfigSchema);
