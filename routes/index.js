const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const wordsController = require('../controllers/words');

//注册
router.post('/register', userController.hasUsername, userController.signup);
//登陆
router.post('/login', userController.login, userController.login);

//查看我的所有话语
router.get('/mywords', userController.checkUser, wordsController.getMyAllWords);
//创建话语
router.post('/words', userController.checkUser, wordsController.addWords);
//删除话语
router.delete('/words/:wordsid', userController.checkUser, wordsController.removeWords);
//查看一个话语
router.get('/words/:wordsid', wordsController.getWords);

module.exports = router;
