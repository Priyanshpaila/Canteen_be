const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["ate", "missed", "not_marked"],
      default: "not_marked",
    },
    isAutoMarked: { type: Boolean, default: false },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin or self
    isAdminOverride: { type: Boolean, default: false },
    price: { type: Number }, // populated from MealPrice
  },
  { timestamps: true }
);

mealSchema.index({ user: 1, date: 1 }, { unique: true }); // Prevent duplicates

module.exports = mongoose.model("Meal", mealSchema);
