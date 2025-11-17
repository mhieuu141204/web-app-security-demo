const express = require('express');
const app = express();
const port = 8080;

// Lấy mật khẩu từ biến môi trường
const dbSecret = process.env.DB_PASSWORD || 'Mật khẩu CHƯA được cấu hình';

app.get('/', (req, res) => {
  res.send('<h1>Chào mừng đến với Web App Bảo Mật!</h1>');
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server đang chạy.' });
});

// Endpoint quan trọng để demo Secret Management
app.get('/db-status', (req, res) => {
  // Trong ứng dụng thực tế, mật khẩu này sẽ được dùng để kết nối DB
  const statusMessage = `Trạng thái DB: Kết nối thành công (giả định). 
Mật khẩu được đọc: ${dbSecret}`;

  res.send(`
    <h2>Trạng thái Kết nối Database:</h2>
    <pre>${statusMessage}</pre>
  `);
});

app.listen(port, () => {
  console.log(`Ứng dụng đang lắng nghe tại http://localhost:${port}`);
  console.log(`Sử dụng DB_PASSWORD: ${dbSecret}`);
});