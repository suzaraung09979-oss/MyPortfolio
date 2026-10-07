const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require('../config/db');
const verifyToken = require('../middleware/authMiddleware');

// 1. CREATE: ကျွမ်းကျင်မှု အသစ်ထည့်ရန် (Protected)
router.post('/', verifyToken, async (req, res) => {
    const { SkillName, Category } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('SkillName', sql.VarChar, SkillName)
            .input('Category', sql.VarChar, Category)
            .query("INSERT INTO Skills (SkillName, Category) VALUES (@SkillName, @Category)");
        res.status(201).send({ message: 'Skill created successfully' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// 2. READ (All): ကျွမ်းကျင်မှု အားလုံးယူရန် (Public)
router.get('/', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query("SELECT * FROM Skills");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// 3. UPDATE: ကျွမ်းကျင်မှု အချက်အလက် ပြင်ဆင်ရန် (Protected)
router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { SkillName, Category } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Id', sql.Int, id)
            .input('SkillName', sql.VarChar, SkillName)
            .input('Category', sql.VarChar, Category)
            .query("UPDATE Skills SET SkillName = @SkillName, Category = @Category WHERE Id = @Id");
        res.send({ message: 'Skill updated successfully' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// 4. DELETE: ကျွမ်းကျင်မှု ဖျက်ရန် (Protected)
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Id', sql.Int, id)
            .query("DELETE FROM Skills WHERE Id = @Id");
        res.send({ message: 'Skill deleted successfully' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;