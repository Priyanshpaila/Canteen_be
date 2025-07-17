const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guest.controller');
const { protect, restrictTo } = require('../middlewares/auth');

router.use(protect); // all routes require authentication

// Only admin or superadmin can mark guest meals
router.post('/', restrictTo('admin', 'superadmin'), guestController.createGuestMeal);

// Everyone (admin/superadmin) can view guest meal records
router.get('/', restrictTo('admin', 'superadmin'), guestController.getAllGuestMeals);

// Only admin/superadmin can update or delete guest meal entries
router.put('/:id', restrictTo('admin', 'superadmin'), guestController.updateGuestMeal);
router.delete('/:id', restrictTo('admin', 'superadmin'), guestController.deleteGuestMeal);

module.exports = router;
