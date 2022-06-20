const express = require('express')
const router = express.Router() //初始化路由

const CartController = require('../controller/cart/cart')

// 加入购物车
router.post('/api/cart/addcart/:productId', CartController.addTocart)

// 获取购物车列表
router.get('/api/cart/list', CartController.getCartList)

// 删除购物车商品
router.delete('/api/cart/delete/:productId', CartController.deleteCart)


//向外暴露
module.exports = router;


