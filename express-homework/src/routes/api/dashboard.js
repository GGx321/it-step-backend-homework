const express = require('express');
const router = express.Router();
const { getStats, getReport } = require('../../controllers/dashboardController');

router.get('/stats', getStats);
router.get('/report', getReport);

module.exports = router;
