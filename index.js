const express = require('express');
require('express-async-errors');
const db = require('./utils/db');
const bodyParser = require('body-parser')
const routes = require('./routes');
const config = require('./config/config');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/api', routes)

//访问静态页面资源
app.use(express.static(path.resolve(__dirname, './dist')));

//访问单页
app.get('*', function (req, res) {
  var html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8');
  res.send(html);
});

//全局错误捕获
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    code: 500,
    msg: '服务器发生错误'
  });
});

const server = app.listen(config.listenPort, () => {
  console.log(`开始监听端口${config.listenPort}`);
})
