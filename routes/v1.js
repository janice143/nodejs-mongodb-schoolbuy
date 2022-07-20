const express = require('express')
const router = express.Router() //初始化路由

const Captchas = require('../controller/v1/captchas')

// 注册
router.post('/captchas', Captchas.getCaptchas);

module.exports = router

