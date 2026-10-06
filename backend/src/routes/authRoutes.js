const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, connectDB } = require('../config/db');

// Secret Key for JWT (Environment variable ထဲမှာ ထည့်ရင် ပိုကောင်းပါတယ်)
const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_key';

// 1. REGISTER: Admin အသစ်ဖန်တီးရန် (Password ကို Hash လုပ်ပြီး သိမ်းမည်)
router.post('/register', async (req, res) => {
  try {
    const { Username, Password } = req.body;

    // Password ကို Hash လုပ်ခြင်း (Salt rounds: 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    const pool = await connectDB();
    await pool.request()
      .input('Username', sql.NVarChar, Username)
      .input('PasswordHash', sql.NVarChar, hashedPassword)
      .query(`
        INSERT INTO AdminUsers (Username, PasswordHash)
        VALUES (@Username, @PasswordHash)
      `);

    res.status(201).json({ message: 'Admin registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error (Username may already exist)');
  }
});

// 2. LOGIN: Admin လော့ဂ်အင်ဝင်ရန်
router.post('/login', async (req, res) => {
  try {
    const { Username, Password } = req.body;

    const pool = await connectDB();
    const result = await pool.request()
      .input('Username', sql.NVarChar, Username)
      .query('SELECT * FROM AdminUsers WHERE Username = @Username');

    if (result.recordset.length === 0) {
      return res.status(400).json({ message: 'Invalid Username or Password' });
    }

    const admin = result.recordset[0];

    // Password တိုက်ဆိုင်စစ်ဆေးခြင်း
    const isMatch = await bcrypt.compare(Password, admin.PasswordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Username or Password' });
    }

    // JWT Token ထုတ်ပေးခြင်း (သက်တမ်း 1 နာရီ သတ်မှတ်ထားသည်)
    const token = jwt.sign({ id: admin.Id, username: admin.Username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Login successful!',
      token: token
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;