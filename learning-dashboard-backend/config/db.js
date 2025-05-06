// config/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 指向你的现有数据库文件
const dbPath = path.join(
  'C:',
  'Users',
  '86180',
  'Desktop',
  '毕设',
  '代码和数据文件',
  'dashboard_2',
  'learning-dashboard-backend',
  'learning_system.db'
);

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('数据库连接失败:', err);
  } else {
    console.log('已成功连接到已有数据库:', dbPath);
  }
});

module.exports = db;