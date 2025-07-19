const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middlewares/auth');

// 🔐 Public Routes
router.post('/signup', userController.signUp);
router.post('/login', userController.login);

// 🔒 Protected Routes (User Logged In)
router.use(protect);

router.get('/me', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/change-pin', userController.changePin);
router.post('/logout', userController.logout);
router.patch('/inform-daily', userController.updateInformDaily);

// 🔐 Superadmin Only
router.patch('/update-role', restrictTo('superadmin'), userController.updateUserRole);
router.delete('/:userId', protect, restrictTo('superadmin'), userController.deleteUser); // ✅ Delete user

module.exports = router;
