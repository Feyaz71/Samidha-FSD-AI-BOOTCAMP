const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.post('/submit', assignmentController.submitAssignment);

module.exports = router;
