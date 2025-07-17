const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件設定
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.')); // 提供靜態檔案服務

// 建立資料庫連接
const db = new sqlite3.Database('./promise_keepers.db', (err) => {
  if (err) {
    console.error('資料庫連接錯誤:', err.message);
  } else {
    console.log('成功連接到 SQLite 資料庫');
    initDatabase();
  }
});

// 初始化資料庫表格
function initDatabase() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      dance_style TEXT,
      experience TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createTableSQL, (err) => {
    if (err) {
      console.error('建立表格錯誤:', err.message);
    } else {
      console.log('註冊表格已建立或已存在');
    }
  });
}

// API 路由

// 處理報名表單提交
app.post('/api/register', (req, res) => {
  const { name, age, phone, email, dance_style, experience, message } = req.body;

  // 基本驗證
  if (!name || !age || !phone || !email) {
    return res.status(400).json({
      success: false,
      message: '請填寫所有必填欄位'
    });
  }

  if (age < 10 || age > 25) {
    return res.status(400).json({
      success: false,
      message: '年齡請填寫10-25歲之間'
    });
  }

  // Email 格式驗證
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({
      success: false,
      message: '請輸入有效的電子信箱地址'
    });
  }

  // 插入資料到資料庫
  const insertSQL = `
    INSERT INTO registrations (name, age, phone, email, dance_style, experience, message)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(insertSQL, [name, age, phone, email, dance_style, experience, message], function(err) {
    if (err) {
      console.error('插入資料錯誤:', err.message);
      return res.status(500).json({
        success: false,
        message: '報名失敗，請稍後再試'
      });
    }

    res.json({
      success: true,
      message: '報名成功！我們會盡快與您聯絡',
      registrationId: this.lastID
    });
  });
});

// 取得所有報名資料 (管理員用)
app.get('/api/registrations', (req, res) => {
  const sql = 'SELECT * FROM registrations ORDER BY created_at DESC';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('查詢資料錯誤:', err.message);
      return res.status(500).json({
        success: false,
        message: '查詢失敗'
      });
    }

    res.json({
      success: true,
      data: rows
    });
  });
});

// 取得特定報名資料
app.get('/api/registrations/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM registrations WHERE id = ?';
  
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('查詢資料錯誤:', err.message);
      return res.status(500).json({
        success: false,
        message: '查詢失敗'
      });
    }

    if (!row) {
      return res.status(404).json({
        success: false,
        message: '找不到該報名資料'
      });
    }

    res.json({
      success: true,
      data: row
    });
  });
});

// 刪除報名資料 (管理員用)
app.delete('/api/registrations/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM registrations WHERE id = ?';
  
  db.run(sql, [id], function(err) {
    if (err) {
      console.error('刪除資料錯誤:', err.message);
      return res.status(500).json({
        success: false,
        message: '刪除失敗'
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        success: false,
        message: '找不到該報名資料'
      });
    }

    res.json({
      success: true,
      message: '刪除成功'
    });
  });
});

// 統計報名人數
app.get('/api/statistics', (req, res) => {
  const sql = 'SELECT COUNT(*) as total FROM registrations';
  
  db.get(sql, [], (err, row) => {
    if (err) {
      console.error('統計查詢錯誤:', err.message);
      return res.status(500).json({
        success: false,
        message: '統計查詢失敗'
      });
    }

    res.json({
      success: true,
      data: {
        totalRegistrations: row.total
      }
    });
  });
});

// 提供主頁面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'promise_keepers.html'));
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '伺服器內部錯誤'
  });
});

// 404 處理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '找不到該頁面'
  });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`);
  console.log('按 Ctrl+C 停止伺服器');
});

// 優雅關閉
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('關閉資料庫錯誤:', err.message);
    } else {
      console.log('資料庫連接已關閉');
    }
    process.exit(0);
  });
}); 