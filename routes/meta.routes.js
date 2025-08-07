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



// Public GET routes (accessible to all authenticated users)
router.get('/division', getAllItems(Division));
router.get('/department', getAllItems(Department));
router.get('/designation', getAllItems(Designation));

router.use(protect, restrictTo('superadmin'));

// Division (restricted)
router.post('/division', createItem(Division));
router.put('/division/:id', updateItem(Division));
router.delete('/division/:id', deleteItem(Division));

// Department (restricted)
router.post('/department', createItem(Department));
router.put('/department/:id', updateItem(Department));
router.delete('/department/:id', deleteItem(Department));

// Designation (restricted)
router.post('/designation', createItem(Designation));
router.put('/designation/:id', updateItem(Designation));
router.delete('/designation/:id', deleteItem(Designation));

module.exports = router;
