const express = require('express');
const router = express.Router();
const { sql, connectDB } = require('../config/db');
const verifyToken = require('../middleware/authMiddleware'); // Middleware ကို ဂျာနယ်တင်ခြင်း

// 1. GET: Projects အားလုံးကို ယူရန် (Public - မည်သူမဆို ကြည့်နိုင်သည်)
router.get('/', async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Projects');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 2. POST: Project အသစ် ထည့်သွင်းရန် (Admin သီးသန့် - verifyToken ထည့်ထားသည်)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { Title, Description, TechStack, ProjectUrl, GithubUrl } = req.body;
    const AdminId = req.admin.id; // Token မှတဆင့် Admin ID ကို အလိုအလျောက် ယူသုံးခြင်း

    const pool = await connectDB();
    await pool.request()
      .input('Title', sql.NVarChar, Title)
      .input('Description', sql.NVarChar, Description)
      .input('TechStack', sql.NVarChar, TechStack)
      .input('ProjectUrl', sql.NVarChar, ProjectUrl)
      .input('GithubUrl', sql.NVarChar, GithubUrl)
      .input('AdminId', sql.Int, AdminId)
      .query(`
        INSERT INTO Projects (Title, Description, TechStack, ProjectUrl, GithubUrl, AdminId)
        VALUES (@Title, @Description, @TechStack, @ProjectUrl, @GithubUrl, @AdminId)
      `);

    res.status(201).json({ message: 'Project added successfully by Admin!' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 3. PUT: ရှိပြီးသား Project ကို ID ဖြင့် ပြင်ဆင်ရန် (Admin သီးသန့်)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { Title, Description, TechStack, ProjectUrl, GithubUrl } = req.body;

    const pool = await connectDB();
    await pool.request()
      .input('Id', sql.Int, id)
      .input('Title', sql.NVarChar, Title)
      .input('Description', sql.NVarChar, Description)
      .input('TechStack', sql.NVarChar, TechStack)
      .input('ProjectUrl', sql.NVarChar, ProjectUrl)
      .input('GithubUrl', sql.NVarChar, GithubUrl)
      .query(`
        UPDATE Projects 
        SET Title = @Title, 
            Description = @Description, 
            TechStack = @TechStack, 
            ProjectUrl = @ProjectUrl, 
            GithubUrl = @GithubUrl
        WHERE Id = @Id
      `);

    res.json({ message: 'Project updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 4. DELETE: Project ကို ID ဖြင့် ဖျက်ရန် (Admin သီးသန့်)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await connectDB();
    await pool.request()
      .input('Id', sql.Int, id)
      .query('DELETE FROM Projects WHERE Id = @Id');

    res.json({ message: 'Project deleted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;