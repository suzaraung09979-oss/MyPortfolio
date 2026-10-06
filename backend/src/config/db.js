const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false, // Local MS SQL အတွက် false ထားရန်
    trustServerCertificate: true // SSL Certificate ယုံကြည်ရန်
  }
};

const connectDB = async () => {
  try {
    let pool = await sql.connect(config);
    console.log('MS SQL Database Connected Successfully!');
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

module.exports = { sql, connectDB };