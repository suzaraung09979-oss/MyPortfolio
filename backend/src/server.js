const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const skillRoutes = require('./routes/skillRoutes');
const contactRoutes = require('./routes/contactRoutes');
const app = express();
app.use(express.json());
app.use(cors());

// Database ချိတ်ဆက်မှုကို စတင်ရန်
connectDB();

// Routes များကို ချိတ်ဆက်ခြင်း
app.use('/api/projects', projectRoutes);

//Admin Register and Login
app.use('/api/auth',authRoutes);

// Profile
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});