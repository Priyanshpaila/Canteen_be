const MealPrice = require('../models/MealPrice');

exports.createMealPrice = async (req, res) => {
  try {
    const data = await MealPrice.create({ ...req.body, calculatedBy: req.user._id });
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllMealPrices = async (req, res) => {
  const prices = await MealPrice.find().sort({ date: -1 });
  res.json(prices);
};

exports.updateMealPrice = async (req, res) => {
  const updated = await MealPrice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteMealPrice = async (req, res) => {
  await MealPrice.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
