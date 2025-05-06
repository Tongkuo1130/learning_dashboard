const db = require('./db');

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  // 通用查询方法
  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // 根据ID查找
  findById(id) {
    return this.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
  }

  // 查找所有记录
  findAll() {
    return this.query(`SELECT * FROM ${this.tableName}`);
  }
}

module.exports = BaseModel;
