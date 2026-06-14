const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/register', studentController.registerStudent);
router.post('/profile', studentController.getStudentProfile);

module.exports = router;
