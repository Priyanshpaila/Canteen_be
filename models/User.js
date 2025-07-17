const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true },
    pin: { type: String, required: true },
    fullName: { type: String, required: true },
    canteenRole: {
      type: String,
      enum: ["superadmin", "admin", "user"],
      default: "user",
    },
    informDaily: { type: Boolean, default: false },
    division: { type: mongoose.Schema.Types.ObjectId, ref: "Division" },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    designation: { type: mongoose.Schema.Types.ObjectId, ref: "Designation" },
    signatureUrl: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("pin")) return next();
  const salt = await bcrypt.genSalt(10);
  this.pin = await bcrypt.hash(this.pin, salt);
  next();
});

userSchema.methods.comparePin = async function (pin) {
  return bcrypt.compare(pin, this.pin);
};

module.exports = mongoose.model("User", userSchema);
