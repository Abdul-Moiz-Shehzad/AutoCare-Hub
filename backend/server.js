const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/manager', require('./src/routes/managerRoutes'));
app.use('/api/customer', require('./src/routes/customerRoutes'));
app.use('/api/mechanic', require('./src/routes/mechanicRoutes'));
app.use('/api/upload', require('./src/routes/uploadRoutes'));
app.use('/api/services', require('./src/routes/servicesRoutes'));


const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

app.get('/', (req, res) => {
  res.send('AutoCare Hub API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
