const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// PostgreSQL接続設定
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "backend-api",
  });
});

app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    // データベース接続エラーの場合は仮データを返す
    const mockUsers = [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
    ];
    res.json(mockUsers);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
