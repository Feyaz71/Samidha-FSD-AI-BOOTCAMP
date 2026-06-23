const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/samidha_bootcamp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Basic Route
app.get('/', (req, res) => {
  res.send('Samidha Bootcamp Portal API is running');
});

// Routes will be imported here
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/test-assignments', require('./routes/testAssignmentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/announcements', require('./routes/announcementRoutes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
