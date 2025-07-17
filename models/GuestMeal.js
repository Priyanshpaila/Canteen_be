const mongoose = require("mongoose");

const guestMealSchema = new mongoose.Schema(
  {
    guestName: { type: String, required: true },
    date: { type: Date, required: true },
    mealType: { type: String, enum: ["lunch", "dinner"], required: true },
    isPaid: { type: Boolean, default: false },
    amount: { type: Number, required: true },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    remarks: { type: String },
  },
  { timestamps: true }
);

guestMealSchema.index({ guestName: 1, date: 1 });

module.exports = mongoose.model("GuestMeal", guestMealSchema);
