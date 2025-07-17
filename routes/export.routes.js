const express = require('express');
const router = express.Router();
const exportController = require('../controllers/export.controller');
const { protect, restrictTo } = require('../middlewares/auth');

router.use(protect);
router.use(restrictTo('admin', 'superadmin'));

router.get('/monthly-meals', exportController.exportMonthlyMealReport);
// Add other exports if needed (guest, price logs, etc.)

module.exports = router;
