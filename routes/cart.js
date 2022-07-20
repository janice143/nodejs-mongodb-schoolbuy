const express = require('express')
const router = express.Router() //初始化路由
const isAuth = require('../middlewares/isAuth')
const CartController = require('../controller/cart/cart')

// 加入购物车
router.post('/api/cart/addcart/:productId', isAuth, CartController.addTocart)

// 获取购物车列表
router.get('/api/cart/list', isAuth, CartController.getCartList)

// 删除购物车商品
router.delete('/api/cart/delete/:productId', isAuth, CartController.deleteCart)


//向外暴露
module.exports = router;


