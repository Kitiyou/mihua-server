const User = require('../models/user');
const { encodeToken, decodeToken } = require('../utils/encryption')

//检查用户名是否已存在
exports.hasUsername = async function (req, res, next) {
  let { username } = req.body;
  let result = await User.findOne({ username });
  if (result) {
    res.json({
      code: 101,
      msg: '用户名已存在'
    });
  }
  else {
    next();
  }
}

//添加用户
exports.signup = async function (req, res) {
  let { username, nickname, password } = req.body;
  //TODO: 验证数据是否合法
  //TODO: 密码加密
  let result = await User.create({ username, nickname, password });
  if (result) {
    res.json({
      code: 0,
      data: {
        nickname,
        token: encodeToken({ username, password })
      }
    });
  }
  else {
    res.json({
      code: 102,
      msg: '注册失败'
    });
  }
}

//登陆
exports.login = async function (req, res) {
  let { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    let { nickname } = user;
    res.json({
      code: 0,
      data: {
        nickname,
        token: encodeToken({ username, password })
      }
    });
  }
  else {
    res.json({
      code: 103,
      msg: '用户名或密码错误'
    });
  }
}

function send401(res) {
  res.status(401).json({
    code: 401,
    msg: '未登录'
  });
}
//检查用户是否已登陆，将用户_id放入req
exports.checkUser = async function (req, res, next) {
  let token = req.headers['authorization'];
  if (!token) {
    send401(res);
    return;
  }
  try {
    const decode = decodeToken(token);
    let { username, password } = decode;
    if (username && password) {
      const user = await User.findOne({ username, password });
      if (user) {
        req.userId = user._id;
        next();
        return;
      }
    }
    send401(res);
  }
  catch {
    send401(res);
  }
}
