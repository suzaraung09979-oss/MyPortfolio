const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require('../config/db');
const verifyToken = require('../middleware/authMiddleware');

// 1. CREATE: Visitor များ Message ပို့ရန် (Public)
router.post('/', async (req, res) => {
    const { SenderName, SenderEmail, Message } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('SenderName', sql.VarChar, SenderName)
            .input('SenderEmail', sql.VarChar, SenderEmail)
            .input('Message', sql.VarChar, Message)
            .query("INSERT INTO ContactMessages (SenderName, SenderEmail, Message, CreatedAt) VALUES (@SenderName, @SenderEmail, @Message, GETDATE())");
        res.status(201).send({ message: 'Message sent successfully' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// 2. READ (All): ပို့ထားသော Message များကို Admin ကြည့်ရန် (Protected)
router.get('/', verifyToken, async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query("SELECT * FROM ContactMessages ORDER BY CreatedAt DESC");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// 3. DELETE: မက်ဆေ့ချ် ဖျက်ရန် (Protected)
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Id', sql.Int, id)
            .query("DELETE FROM ContactMessages WHERE Id = @Id");
        res.send({ message: 'Message deleted successfully' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;