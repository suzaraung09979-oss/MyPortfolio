const express = require('express');
const router = express.Router();
const { sql, connectDB } = require('../config/db');
const verifyToken = require('../middleware/authMiddleware');

// 1. GET: Profile အချက်အလက်ကို ယူရန် (Public - မည်သူမဆို ကြည့်နိုင်သည်)
router.get('/', async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT TOP 1 * FROM Profile');
    res.json(result.recordset[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 2. POST / PUT: Profile အချက်အလက် ထည့်ရန် သို့မဟုတ် ပြင်ရန် (Admin သီးသန့်)
router.post('/', verifyToken, async (req, res) => {
  try {
    // Database ထဲက Column နာမည်အတိုင်း JobTitle ဟု ပြင်ဆင်ထားသည်
    const { FullName, JobTitle, Bio, Email, Phone, GithubUrl, LinkedinUrl } = req.body;

    const pool = await connectDB();
    
    // Profile က တစ်ခုတည်းပဲ ရှိရမှာမို့လို့ Table ထဲမှာ Data ရှိပြီးသားလား စစ်ဆေးခြင်း
    const checkExist = await pool.request().query('SELECT COUNT(*) as count FROM Profile');
    const exists = checkExist.recordset[0].count > 0;

    if (exists) {
      // ရှိပြီးသားဆိုရင် Update လုပ်မည်
      await pool.request()
        .input('FullName', sql.NVarChar, FullName)
        .input('JobTitle', sql.NVarChar, JobTitle) // JobTitle သို့ ပြောင်းထားသည်
        .input('Bio', sql.NVarChar, Bio)
        .input('Email', sql.NVarChar, Email)
        .input('Phone', sql.NVarChar, Phone)
        .input('GithubUrl', sql.NVarChar, GithubUrl)
        .input('LinkedinUrl', sql.NVarChar, LinkedinUrl)
        .query(`
          UPDATE Profile 
          SET FullName = @FullName, 
              JobTitle = @JobTitle, -- JobTitle သို့ ပြောင်းထားသည်
              Bio = @Bio, 
              Email = @Email, 
              Phone = @Phone, 
              GithubUrl = @GithubUrl, 
              LinkedinUrl = @LinkedinUrl
        `);
      res.json({ message: 'Profile updated successfully by Admin!' });
    } else {
      // မရှိသေးရင် အသစ် Insert လုပ်မည်
      await pool.request()
        .input('FullName', sql.NVarChar, FullName)
        .input('JobTitle', sql.NVarChar, JobTitle) // JobTitle သို့ ပြောင်းထားသည်
        .input('Bio', sql.NVarChar, Bio)
        .input('Email', sql.NVarChar, Email)
        .input('Phone', sql.NVarChar, Phone)
        .input('GithubUrl', sql.NVarChar, GithubUrl)
        .input('LinkedinUrl', sql.NVarChar, LinkedinUrl)
        .query(`
          INSERT INTO Profile (FullName, JobTitle, Bio, Email, Phone, GithubUrl, LinkedinUrl)
          VALUES (@FullName, @JobTitle, @Bio, @Email, @Phone, @GithubUrl, @LinkedinUrl)
        `);
      res.status(201).json({ message: 'Profile created successfully by Admin!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 3. PUT: Profile ကို သီးသန့်ပြင်ဆင်ရန် (Admin သီးသန့်)
router.put('/', verifyToken, async (req, res) => {
  try {
    const { FullName, JobTitle, Bio, Email, Phone, GithubUrl, LinkedinUrl } = req.body;

    const pool = await connectDB();
    await pool.request()
      .input('FullName', sql.NVarChar, FullName)
      .input('JobTitle', sql.NVarChar, JobTitle)
      .input('Bio', sql.NVarChar, Bio)
      .input('Email', sql.NVarChar, Email)
      .input('Phone', sql.NVarChar, Phone)
      .input('GithubUrl', sql.NVarChar, GithubUrl)
      .input('LinkedinUrl', sql.NVarChar, LinkedinUrl)
      .query(`
        UPDATE Profile 
        SET FullName = @FullName, 
            JobTitle = @JobTitle, 
            Bio = @Bio, 
            Email = @Email, 
            Phone = @Phone, 
            GithubUrl = @GithubUrl, 
            LinkedinUrl = @LinkedinUrl
      `);

    res.json({ message: 'Profile updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 4. DELETE: Profile အချက်အလက်များကို ဖျက်ရန် (Admin သီးသန့်)
router.delete('/', verifyToken, async (req, res) => {
  try {
    const pool = await connectDB();
    await pool.request().query('DELETE FROM Profile');

    res.json({ message: 'Profile deleted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;