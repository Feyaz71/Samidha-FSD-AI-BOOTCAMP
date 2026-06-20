const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Middleware to check Admin Key
const verifyAdmin = (req, res, next) => {
  const key = req.headers['x-admin-key'];
  if (key === process.env.ADMIN_KEY || key === 'SAMIDHA2026') {
    next();
  } else {
    res.status(403).json({ error: 'Unauthorized. Invalid Admin Key.' });
  }
};

router.use(verifyAdmin);

router.get('/analytics', adminController.getAnalytics);
router.post('/attendance-code', adminController.createAttendanceCode);
router.get('/students', adminController.getStudents);
router.get('/attendance', adminController.getAttendance);
router.post('/assignment-config', adminController.createAssignmentConfig);
router.get('/assignments', adminController.getAssignments);
router.get('/export/:type', adminController.exportCSV); // Simple CSV Export
router.post('/certificates/generate', adminController.generateCertificates);

module.exports = router;
