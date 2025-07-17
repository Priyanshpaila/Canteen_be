const mongoose = require("mongoose");

const designationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Designation", designationSchema);
