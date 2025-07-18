const express = require('express');
const router = express.Router();
const priceController = require('../controllers/price.controller');
const { protect, restrictTo } = require('../middlewares/auth');

// All routes require auth & role check
router.use(protect);
router.use(restrictTo('admin', 'superadmin'));

// 📌 Set or overwrite meal price (upsert)
router.post('/', priceController.setMealPrice);

// 📄 View all prices (optionally filter by date)
router.get('/', priceController.getMealPrices);

// ✏️ Update price record
router.patch('/:id', priceController.updateMealPrice);

// ❌ Delete price record
router.delete('/:id', priceController.deleteMealPrice);

module.exports = router;
