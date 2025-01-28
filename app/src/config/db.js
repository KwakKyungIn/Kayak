require('dotenv').config();
const mysql = require('mysql2/promise');

// 데이터베이스 연결 설정
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// 연결 확인
db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to the database. 연결성공');
        connection.release();
    }
});

module.exports = db;
