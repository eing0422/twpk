# Promise Keepers 敬拜舞蹈團官方網站

這是一個完整的舞蹈營會報名系統，包含前端網站和後端資料庫管理。

## 功能特色

- 🎨 響應式設計的現代化網站
- 📝 線上報名表單
- 💾 SQLite 資料庫儲存
- 🔍 管理後台查看報名資料
- 📊 統計報名人數
- 🔐 資料驗證和安全處理

## 系統需求

- Node.js (建議版本 18.0.0 或以上)
- npm 或 yarn

## 安裝步驟

### 1. 安裝依賴套件

```bash
npm install
```

### 2. 啟動伺服器

```bash
npm start
```

或者使用開發模式（自動重啟）：

```bash
npm run dev
```

### 3. 存取網站

- 主網站：http://localhost:3000
- 管理後台：http://localhost:3000/admin.html

## 檔案結構

```
├── promise_keepers.html    # 主網站頁面
├── admin.html             # 管理後台頁面
├── server.js              # Express 伺服器
├── package.json           # 專案設定檔
├── promise_keepers.db     # SQLite 資料庫 (自動建立)
├── README.md              # 說明文件
└── *.jpg                  # 圖片資源
```

## API 端點

### 報名相關

- `POST /api/register` - 提交報名表單
- `GET /api/registrations` - 取得所有報名資料
- `GET /api/registrations/:id` - 取得特定報名資料
- `DELETE /api/registrations/:id` - 刪除報名資料
- `GET /api/statistics` - 取得統計資料

### 請求範例

#### 提交報名

```javascript
fetch('/api/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: '張小明',
    age: 15,
    phone: '0912345678',
    email: 'test@example.com',
    dance_style: '現代舞',
    experience: '初學者',
    message: '希望能學習更多舞蹈技巧'
  })
});
```

#### 取得所有報名資料

```javascript
fetch('/api/registrations')
  .then(response => response.json())
  .then(data => console.log(data));
```

## 資料庫結構

### registrations 表格

| 欄位名稱 | 類型 | 說明 |
|---------|------|------|
| id | INTEGER | 主鍵，自動遞增 |
| name | TEXT | 姓名 (必填) |
| age | INTEGER | 年齡 (必填，10-25歲) |
| phone | TEXT | 聯絡電話 (必填) |
| email | TEXT | 電子信箱 (必填) |
| dance_style | TEXT | 舞蹈風格 (選填) |
| experience | TEXT | 舞蹈經驗 (選填) |
| message | TEXT | 留言 (選填) |
| created_at | DATETIME | 建立時間 (自動) |

## 管理後台功能

- 📊 查看報名統計
- 📋 瀏覽所有報名資料
- 🔍 搜尋特定報名者
- 👁️ 查看詳細資料
- 🗑️ 刪除報名資料
- 🔄 重新整理資料

## 安全性考量

- 輸入資料驗證
- SQL 注入防護
- CORS 設定
- 錯誤處理

## 部署建議

### 本地開發

```bash
npm run dev
```

### 生產環境

```bash
npm start
```

建議使用 PM2 來管理 Node.js 程序：

```bash
npm install -g pm2
pm2 start server.js --name "promise-keepers"
```

## 自訂設定

### 修改端口

在 `server.js` 中修改：

```javascript
const PORT = process.env.PORT || 3000;
```

### 修改資料庫路徑

在 `server.js` 中修改：

```javascript
const db = new sqlite3.Database('./your_database.db', (err) => {
  // ...
});
```

## 故障排除

### 常見問題

1. **端口被占用**
   - 修改 `server.js` 中的端口號
   - 或關閉占用該端口的程序

2. **資料庫權限錯誤**
   - 確保程式有寫入權限
   - 檢查資料庫檔案路徑

3. **模組找不到**
   - 執行 `npm install` 重新安裝依賴

### 日誌查看

伺服器會在控制台輸出詳細日誌，包括：
- 資料庫連接狀態
- API 請求記錄
- 錯誤訊息

## 技術架構

- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **後端**：Node.js, Express.js
- **資料庫**：SQLite3
- **UI 框架**：Tailwind CSS
- **圖示**：Font Awesome

## 授權

MIT License

## 聯絡資訊

如有問題或建議，請聯絡 Promise Keepers 團隊。 