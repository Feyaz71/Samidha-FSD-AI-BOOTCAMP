const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  student_id: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  email: { type: String },
  mobile: { type: String, required: true },
  institution_name: { type: String, required: true }, // School or College
  year_or_class: { type: String, required: true }, // Year or Class
  registered_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
