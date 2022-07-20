const express = require('express')
const router = express.Router() //初始化路由

const isAuth = require('../middlewares/isAuth')
const UserController = require('../controller/user/user')


// 注册
router.post('/api/user/register',UserController.register)

// 完善
router.post('/api/user/complete', isAuth, UserController.complete)


// 登录
router.post('/api/user/login',UserController.login);

// 获取当前用户信息，需要进行鉴权认证！！！注意此处passport认证策略就是在passport.js中配置的
router.get('/api/user/getInfo',isAuth, UserController.getUserInfo )

// 退出登录，不用认证，token过期的时候好发出申请退出登录
router.get('/api/user/logout',  UserController.logout)


// 后台的登录，鉴权和登出

// 登录
router.post('/api/cms/user/login',UserController.login);

// 获取当前用户信息，需要进行鉴权认证！！！注意此处passport认证策略就是在passport.js中配置的
router.get('/api/cms/user/getInfo',isAuth, UserController.getUserInfo )

// 退出登录，不用认证，token过期的时候好发出申请退出登录
router.get('/api/cms/user/logout', UserController.logout)




module.exports = router




