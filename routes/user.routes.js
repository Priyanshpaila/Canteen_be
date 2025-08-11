const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middlewares/auth');

// 🔐 Public Routes
router.post('/signup', userController.signUp);
router.post('/login', userController.login);

// 🔒 Protected Routes (User Logged In)
router.use(protect);

router.get('/me',protect, userController.getProfile);
router.put('/update-profile',protect, userController.updateProfile);
router.put('/change-pin',protect, userController.changePin);
router.post('/logout',protect, userController.logout);
router.patch('/inform-daily',protect, userController.updateInformDaily);
router.patch('/mark-informed', protect, userController.markAsInformed);

// 🔐 Admin and Superadmin 
router.get('/informed-users', protect, restrictTo('admin', 'superadmin'), userController.getInformedUsers);

// 🔐 Superadmin Only
router.patch('/update-role', restrictTo('superadmin'), userController.updateUserRole);
router.delete('/:userId', protect, restrictTo('superadmin'), userController.deleteUser); // ✅ Delete user
router.get('/users', protect, restrictTo('superadmin'), userController.getAllUsers);

module.exports = router;
