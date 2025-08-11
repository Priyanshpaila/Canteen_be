const Division = require('../models/Division');
const Department = require('../models/Department');
const Designation = require('../models/Designation');

exports.createItem = (Model) => async (req, res) => {
  try {
    const item = await Model.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Creation failed', error: err.message });
  }
};

exports.getAllItems = (Model) => async (req, res) => {
  try {
    const items = await Model.find().sort({ name: 1 });
    res.json({ count: items.length, items });
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

exports.updateItem = (Model) => async (req, res) => {
  try {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
};

exports.deleteItem = (Model) => async (req, res) => {
  try {
    await Model.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed', error: err.message });
  }
};
