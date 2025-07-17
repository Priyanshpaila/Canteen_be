const mongoose = require("mongoose");

const mealPriceSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true },
    price: { type: Number, required: true },
    calculatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    participantCount: { type: Number },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MealPrice", mealPriceSchema);
