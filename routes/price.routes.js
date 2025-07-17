const express = require('express');
const router = express.Router();
const priceController = require('../controllers/price.controller');
const { protect, restrictTo } = require('../middlewares/auth');

router.use(protect);
router.use(restrictTo('admin', 'superadmin'));

router.post('/', priceController.setMealPrice);
router.get('/', priceController.getMealPrices);
router.patch('/:id', priceController.updateMealPrice);
router.delete('/:id', priceController.deleteMealPrice);

module.exports = router;
