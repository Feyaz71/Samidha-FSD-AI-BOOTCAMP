const express = require('express');
const router = express.Router();
const testAssignmentController = require('../controllers/testAssignmentController');

router.get('/active', testAssignmentController.getActiveTestAssignments);
router.post('/submit', testAssignmentController.submitTestAssignment);

module.exports = router;
