const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET,);
};

// ✅ Signup (default role: user, informDaily: false)
exports.signUp = async (req, res) => {
  try {
    const {
      phoneNumber,
      pin,
      empid,
      fullName,
      division,
      department,
      designation,
    } = req.body;

    const existing = await User.findOne({ phoneNumber });
    if (existing)
      return res.status(400).json({ message: "Phone number already registered" });

    const user = await User.create({
      phoneNumber,
      pin,
      empid,
      fullName,
      canteenRole: "user",
      informDaily: false,
      informed: false,
      division,
      department,
      designation,
    });

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        canteenRole: user.canteenRole,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error signing up", error: err.message });
  }
};

// ✅ Login
exports.login = async (req, res) => {
  const { phoneNumber, pin } = req.body;

  const user = await User.findOne({ phoneNumber });
  if (!user || !(await user.comparePin(pin))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user._id);
  res.json({
    token,
    user: {
      _id: user._id,
      fullName: user.fullName,
      canteenRole: user.canteenRole,
    },
  });
};

// ✅ Get Profile
exports.getProfile = async (req, res) => {
  res.json(req.user);
};

// ✅ Update Informing Preference
exports.updateInformDaily = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { informDaily: req.body.informDaily },
      { new: true }
    );
    res.json({ message: 'Inform preference updated', user: updatedUser });
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
};

// ✅ Update Profile (name, division, department, designation)
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, division, department, designation } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, division, department, designation },
      { new: true }
    );

    res.json({ message: "Profile updated", user: updated });
  } catch (err) {
    res.status(400).json({ message: "Failed to update profile", error: err.message });
  }
};

// ✅ Change PIN
exports.changePin = async (req, res) => {
  try {
    const { oldPin, newPin } = req.body;

    const user = await User.findById(req.user._id);
    if (!user || !(await user.comparePin(oldPin))) {
      return res.status(400).json({ message: "Old PIN is incorrect" });
    }

    user.pin = newPin;
    user.isDefaultPin = false;
    await user.save();

    res.json({ message: "PIN updated successfully" });
  } catch (err) {
    res.status(400).json({ message: "Failed to update PIN", error: err.message });
  }
};

// ✅ Logout (handled on frontend)
exports.logout = async (req, res) => {
  res.json({ message: "Logout successful. Clear token on frontend." });
};

// ✅ Superadmin: Update User Role
exports.updateUserRole = async (req, res) => {
  try {
    if (req.user.canteenRole !== 'superadmin') {
      return res.status(403).json({ message: 'Only Superadmin can change roles.' });
    }

    const { userId, newRole } = req.body;
    const allowedRoles = ['admin', 'user'];
    if (!allowedRoles.includes(newRole)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { canteenRole: newRole },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({
      message: 'User role updated successfully',
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        canteenRole: updatedUser.canteenRole,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update role', error: err.message });
  }
};

// ✅ Superadmin: Delete a User
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.canteenRole !== 'superadmin') {
      return res.status(403).json({ message: 'Only Superadmin can delete users.' });
    }

    const { userId } = req.params;

    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};


// ✅ Manually Mark User as Informed
exports.markAsInformed = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user || !user.informDaily) {
      return res.status(400).json({ message: "Only manual-mode users can mark themselves informed." });
    }

    user.informed = true;
    await user.save();

    res.json({ message: "User marked as informed for today." });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark informed", error: err.message });
  }
};


// ✅ Get List of Users Who Informed Today (manual only)
exports.getInformedUsers = async (req, res) => {
  try {
    const users = await User.find({
      informDaily: true,
      informed: true,
    }).select('fullName division department designation');

    res.json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch informed users", error: err.message });
  }
};

