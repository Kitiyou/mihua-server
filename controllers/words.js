const Words = require('../models/words');
const User = require('../models/user');

//添加一个话语
exports.addWords = async function (req, res) {
  let { title, content, publishTime } = req.body;
  let creatorId = req.userId;
  let result = await Words.create({ creatorId, title, content, publishTime });
  if (result) {
    res.json({
      code: 0,
      data: []
    });
  }
  else {
    res.json({
      code: 101,
      msg: '添加话语失败'
    });
  }
}

//删除一个话语
exports.removeWords = async function (req, res) {
  let creatorId = req.userId;
  let wordsId = parseInt(req.params.wordsid);
  let result = await Words.deleteOne({ _id: wordsId, creatorId });
  if (result.deletedCount > 0) {
    res.json({
      code: 0,
      data: []
    });
  }
  else {
    res.status(404).json({
      code: 404,
      msg: '不存在此话语'
    });
  }
}

//获取所有我的话语
exports.getMyAllWords = async function (req, res) {
  let creatorId = req.userId;
  const allWords = await Words.find({ creatorId }).sort({ _id: -1 });
  res.json({
    code: 0,
    data: allWords
  });
}

function send404(res) {
  res.status(404).json({
    code: 404,
    msg: '不存在此话语'
  });
}
//获取一个话语
exports.getWords = async function (req, res) {
  let wordsIdStr = req.params.wordsid;
  if (!/^(0|[1-9][0-9]*)$/.test(wordsIdStr)) {
    send404(res);
    return;
  }
  let wordsId = parseInt(wordsIdStr);
  const word = await Words.findById(wordsId);
  if (!word) {
    send404(res);
    return;
  }
  if (word.publishTime > new Date()) { //未到话语公开时间
    let delay = word.publishTime - new Date();
    res.json({
      code: 0,
      data: { published: false, delay }
    });
  }
  else { //已到话语公开时间
    let { creatorId, title, content, publishTime } = word;
    const creator = await User.findById(creatorId);
    let creatorName = creator.nickname;
    res.json({
      code: 0,
      data: {
        published: true,
        words: { creatorName, title, content, publishTime }
      }
    });
  }
}