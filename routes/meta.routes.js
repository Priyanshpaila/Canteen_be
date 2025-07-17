const express = require('express');
const { protect, restrictTo } = require('../middlewares/auth');
const {
  createItem,
  getAllItems,
  updateItem,
  deleteItem,
} = require('../controllers/meta.controller');

const Division = require('../models/Division');
const Department = require('../models/Department');
const Designation = require('../models/Designation');

const router = express.Router();

// All routes protected -> superadmin only
router.use(protect, restrictTo('superadmin'));

// Division
router.post('/division', createItem(Division));
router.get('/division', getAllItems(Division));
router.put('/division/:id', updateItem(Division));
router.delete('/division/:id', deleteItem(Division));

// Department
router.post('/department', createItem(Department));
router.get('/department', getAllItems(Department));
router.put('/department/:id', updateItem(Department));
router.delete('/department/:id', deleteItem(Department));

// Designation
router.post('/designation', createItem(Designation));
router.get('/designation', getAllItems(Designation));
router.put('/designation/:id', updateItem(Designation));
router.delete('/designation/:id', deleteItem(Designation));

module.exports = router;
