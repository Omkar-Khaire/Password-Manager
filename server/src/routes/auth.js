const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { register, login, logout, me } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Apply rate limiter to all auth routes
router.post('/register', authLimiter, [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 8 characters and include numbers and letters').isLength({ min: 8 })
], register);

router.post('/login', authLimiter, [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], login);

router.post('/logout', logout);
router.get('/me', auth, me);

module.exports = router;