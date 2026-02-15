const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes: verify token from httpOnly cookie or Authorization header
module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    // Optionally attach user object without password
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ error: 'Token is not valid' });
  }
};