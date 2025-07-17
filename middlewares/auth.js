const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  try {
    // 1️⃣ Extract token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 🔒 Reject if token not found
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: Token not provided' });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: Invalid token payload' });
    }

    // 3️⃣ Attach sanitized user object to request
    const user = await User.findById(decoded.id)
      .select('-pin')
      .populate(['division', 'department', 'designation']);

    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: User not found or deactivated' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// 🎯 Role-based access restriction
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.canteenRole)) {
      return res
        .status(403)
        .json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};
