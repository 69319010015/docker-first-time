const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

// ดึงค่า Config จาก Environment Variables (ชี้ Host ไปที่ชื่อ Container ของ MySQL)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'testdb',
  waitForConnections: true,
  connectionLimit: 10
});

// 0. Root Endpoint (เปิด URL หลักแล้วไม่เจอ "Cannot GET /")
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to simple-backend!',
    endpoints: ['/api/students', '/api/health']
  });
});

// 1. Health Check Endpoint (เช็กว่า Backend ต่อ Database ผ่านไหม)
app.get('/api/health', (req, res) => {
  pool.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      return res.status(500).json({ status: 'error', message: err.message });
    }
    res.json({ status: 'ok', db_connection: 'success' });
  });
});

// 2. Sample Data Endpoint
app.get('/api/students', (req, res) => {
  res.json({
    message: 'Hello from Dockerized Backend API!',
    students: [
      { id: 1, name: 'DevOps Student A', role: 'Backend Developer' },
      { id: 2, name: 'DevOps Student B', role: 'Infrastructure' }
    ]
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend API running on port ${PORT}`));
