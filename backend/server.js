const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3001;

// CORS設定を追加
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// PostgreSQL接続設定
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "webapp_db",
  user: process.env.DB_USER || "webapp_user",
  password: process.env.DB_PASSWORD || "password123",
});

// ヘルスチェックエンドポイント
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// ユーザー一覧取得API
app.get("/api/users", async (req, res) => {
  try {
    console.log("Fetching users from database...");
    const result = await pool.query("SELECT * FROM users ORDER BY id");
    console.log(`Found ${result.rows.length} users`);
    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Database connection failed",
      details: error.message,
    });
  }
});

// ルートエンドポイント
app.get("/", (req, res) => {
  res.json({
    message: "Kubernetes Webapp Backend API",
    endpoints: ["GET /health - Health check", "GET /api/users - Get all users"],
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
