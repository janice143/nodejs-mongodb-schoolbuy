const express = require('express')
const router = express.Router() //初始化路由
const role = require('../middlewares/role')
const isAdmin = role.isAdmin;

const ProductController = require('../controller/product/product')
const ProductFrontController = require('../controller/product/productFront')

// ***************************** 后台 ***************************** 
// 按条件获取商品，如果没给参数。就显示全部商品
router.post('/api/productlist',ProductController.getProductlist)

// 上传商品图片
router.post('/api/product/fileUpload',ProductController.postProductFiles)

// 发布（上传）商品信息
router.post('/api/product/saveProduct',ProductController.postProduct)

// 删除商品
router.delete('/api/product/deleteProduct',ProductController.deleteProduct)




// // ***************************** 前台 ***************************** 
// 按照条件展示商品
router.post('/api/front/productlist',ProductFrontController.getProductlistFront)

// 按照商品的productId(就是_id)查找商品详情
router.get('/api/productdetail/:productId',ProductFrontController.getProductdetail)

// 获取商品展示的用户信息
router.get('/api/product/users',ProductFrontController.getUsersdetail)

// 点击想要商品，对应商品的hotScore+1
router.post('/api/want/:productId',ProductFrontController.wantProduct)

// 取消想要商品，对应商品的hotScore-1
router.post('/api/wantno/:productId',ProductFrontController.wantNoProduct)

// 获取用户的想要列表
// router.get('/api/want/list',ProductFrontController.getWantList)




//向外暴露
module.exports = router;