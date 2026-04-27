const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/manager', require('./src/routes/managerRoutes'));
app.use('/api/customer', require('./src/routes/customerRoutes'));
app.use('/api/upload', require('./src/routes/uploadRoutes'));

// Serve uploads folder statically
const dir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(dir));

app.get('/', (req, res) => {
  res.send('AutoCare Hub API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
