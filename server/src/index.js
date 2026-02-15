require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const credentialRoutes = require('./routes/credentials');

const app = express();

// Security middlewares
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize()); // Prevent NoSQL injection

// CORS - allow credentials
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Rate limiter only applied to auth routes (see routes)

// Connect DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/credentials', credentialRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));