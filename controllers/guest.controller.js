const GuestMeal = require('../models/GuestMeal');

exports.createGuestMeal = async (req, res) => {
  try {
    const data = await GuestMeal.create({ ...req.body, markedBy: req.user._id });
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create guest meal', error: err.message });
  }
};

exports.getAllGuestMeals = async (req, res) => {
  try {
    const meals = await GuestMeal.find()
      .sort({ date: -1 })
      .populate('markedBy', 'fullName canteenRole'); // Add more fields if needed
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch guest meals', error: err.message });
  }
};

exports.updateGuestMeal = async (req, res) => {
  try {
    const updated = await GuestMeal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Guest meal not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update guest meal', error: err.message });
  }
};

exports.deleteGuestMeal = async (req, res) => {
  try {
    const deleted = await GuestMeal.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Guest meal not found' });
    }
    res.json({ message: 'Guest meal deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete guest meal', error: err.message });
  }
};
