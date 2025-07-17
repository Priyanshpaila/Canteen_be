const express = require('express');
const router = express.Router();
const mealController = require('../controllers/meal.controller');
const { protect, restrictTo } = require('../middlewares/auth');

router.use(protect);

// 🔘 Mark/Update Meal
router.post('/', restrictTo('admin', 'superadmin', 'user'), mealController.markMeal);

// 🔍 Fetch meals (user can only access their own data)
router.get('/', restrictTo('admin', 'superadmin', 'user'), mealController.getMeals);

// ❌ Delete meal (admin/superadmin only)
router.delete('/:id', restrictTo('admin', 'superadmin'), mealController.deleteMeal);

// 🧠 Auto-mark (admin/superadmin trigger only)
router.post('/auto-mark', restrictTo('admin', 'superadmin'), mealController.autoMarkMeals);

module.exports = router;
