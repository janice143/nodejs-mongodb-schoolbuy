const express = require('express')
const router = express.Router() //初始化路由

const Captchas = require('../controller/v1/captchas')
const Test = require('../controller/v1/test')

// 注册
router.post('/captchas', Captchas.getCaptchas);

// 测试
router.get('/test', Test.getHelloWorld)


module.exports = router

