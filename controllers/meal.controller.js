const Meal = require('../models/Meal');
const MealPrice = require('../models/MealPrice');
const User = require('../models/User');

// 🔘 Mark or update a meal
exports.markMeal = async (req, res) => {
  try {
    const { userId, date, status } = req.body;
    const markedBy = req.user._id;

    const mealDate = new Date(date);
    mealDate.setHours(0, 0, 0, 0);

    const mealPriceDoc = await MealPrice.findOne({ date: mealDate });
    const price = mealPriceDoc ? mealPriceDoc.price : 0;

    let meal = await Meal.findOne({ user: userId, date: mealDate });

    const isAdminOverride = req.user._id.toString() !== userId.toString();

    if (meal) {
      meal.status = status;
      meal.markedBy = markedBy;
      meal.isAdminOverride = isAdminOverride;
      meal.price = price;
      await meal.save();
    } else {
      meal = await Meal.create({
        user: userId,
        date: mealDate,
        status,
        markedBy,
        isAdminOverride,
        price,
        isAutoMarked: false,
      });
    }

    res.status(200).json(meal);
  } catch (err) {
    res.status(400).json({ message: 'Error marking meal', error: err.message });
  }
};

// 🔍 Get all meals (user-specific or filtered)
exports.getMeals = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    const filter = {};

    if (userId) filter.user = userId;
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const meals = await Meal.find(filter)
      .populate('user', 'fullName division department designation')
      .sort({ date: 1 });

    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching meals', error: err.message });
  }
};

// ❌ Delete a meal (Admin/Superadmin only)
exports.deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    res.json({ message: 'Meal deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete meal', error: err.message });
  }
};

// 🧠 Auto mark handler (used by CRON or scheduled job)
exports.autoMarkMeals = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const users = await User.find({ informDaily: true });
    const mealPriceDoc = await MealPrice.findOne({ date: today });
    const price = mealPriceDoc ? mealPriceDoc.price : 0;

    let count = 0;

    for (let user of users) {
      const exists = await Meal.findOne({ user: user._id, date: today });
      if (!exists) {
        await Meal.create({
          user: user._id,
          date: today,
          status: 'ate',
          isAutoMarked: true,
          price,
        });
        count++;
      }
    }

    res.json({ message: `Auto marked ${count} users for ${today.toDateString()}` });
  } catch (err) {
    res.status(500).json({ message: 'Auto marking failed', error: err.message });
  }
};
