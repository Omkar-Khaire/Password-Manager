const rateLimit = require('express-rate-limit');

// Apply tight rate limit to auth routes to mitigate brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later' }
});

module.exports = { authLimiter };