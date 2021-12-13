const mongoose = require('mongoose');
const config = require('../config/config')

mongoose.connect(config.dbUrl, { useNewUrlParser: true })

mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once('open', () => {
  console.log('已连接数据库');
})

db.on('error', err => {
  console.error(`数据库连接失败: ${err}`);
  mongoose.disconnect();
});

db.on('close', () => {
  console.log('数据库断开，重新连接数据库');
  mongoose.connect(config.dbUrl, { server: { auto_reconnect: true } });
});

module.exports = mongoose;
