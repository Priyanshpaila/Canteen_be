const MealPrice = require('../models/MealPrice');

// 📌 Set price after lunch based on actual participants
exports.setMealPrice = async (req, res) => {
  try {
    const { date, price, participantCount, notes } = req.body;

    if (!date || !price || !participantCount) {
      return res.status(400).json({ message: 'Date, price, and participantCount are required.' });
    }

    const formattedDate = new Date(date);
    formattedDate.setHours(0, 0, 0, 0);

    // Upsert price for the day
    const data = await MealPrice.findOneAndUpdate(
      { date: formattedDate },
      {
        price,
        participantCount,
        notes,
        calculatedBy: req.user._id,
        date: formattedDate,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Meal price set successfully.', data });
  } catch (err) {
    res.status(500).json({ message: 'Failed to set meal price.', error: err.message });
  }
};

// 📄 View all meal prices (optional: filter by date range)
exports.getMealPrices = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const prices = await MealPrice.find(filter)
      .populate('calculatedBy', 'fullName canteenRole')
      .sort({ date: -1 });

    res.json(prices);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching meal prices.', error: err.message });
  }
};

// ✏️ Update price for a specific date
exports.updateMealPrice = async (req, res) => {
  try {
    const updated = await MealPrice.findByIdAndUpdate(
      req.params.id,
      { ...req.body, calculatedBy: req.user._id },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update meal price.', error: err.message });
  }
};

// ❌ Delete meal price record
exports.deleteMealPrice = async (req, res) => {
  try {
    await MealPrice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Meal price deleted successfully.' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete meal price.', error: err.message });
  }
};
