require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/meals', require('./routes/meal.routes'));
app.use('/api/price', require('./routes/price.routes'));
app.use('/api/guests', require('./routes/guest.routes'));
app.use('/api/meta', require('./routes/meta.routes'));
app.use('/api/export', require('./routes/export.routes'));

app.get('/', (req, res) => res.send('Canteen Management Backend Running ✅'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
