const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// เชื่อมต่อ PostgreSQL ผ่าน DATABASE_URL
// บน Render: DATABASE_URL + DB_SSL=true ถูกตั้งให้อัตโนมัติจาก Blueprint
// ในเครื่อง (docker-compose): ใช้ DATABASE_URL และไม่ต้องเปิด SSL
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
      }
    : {}
);

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
