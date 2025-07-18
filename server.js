require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Static folder for Excel exports
app.use('/exports', express.static(path.join(__dirname, 'exports')));

// Base Routes
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/meals', require('./routes/meal.routes'));
app.use('/api/price', require('./routes/price.routes'));
app.use('/api/guests', require('./routes/guest.routes'));
app.use('/api/meta', require('./routes/meta.routes'));
app.use('/api/export', require('./routes/export.routes'));

// Health check route
app.get('/', (req, res) => res.send('Canteen Management Backend Running ✅'));

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ message: 'Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
