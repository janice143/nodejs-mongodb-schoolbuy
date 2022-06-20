const express = require('express')
const router = express.Router() //初始化路由

const isAuth = require('../middlewares/isAuth')
const UserController = require('../controller/user/user')


// 注册
router.post('/api/user/register',UserController.register)

// 完善
router.post('/api/user/complete',UserController.complete)


// 登录
router.post('/api/user/login',UserController.login);

// 获取当前用户信息，需要进行鉴权认证！！！注意此处passport认证策略就是在passport.js中配置的
router.get('/api/user/getInfo',isAuth, UserController.getUserInfo )

// 退出登录
router.get('/api/user/logout',UserController.logout)


module.exports = router




