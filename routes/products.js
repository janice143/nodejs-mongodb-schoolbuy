const express = require('express')
const router = express.Router() //初始化路由

const isAuth = require('../middlewares/isAuth')

const ProductController = require('../controller/product/product')
const ProductFrontController = require('../controller/product/productFront')

// ***************************** 后台 ***************************** 
// 按条件获取商品，如果没给参数。就显示全部商品
router.post('/api/productlist', isAuth, ProductController.getProductlist)

// 上传商品图片，不给权限，因为上传图片会发送两次请求，第一次有权限，第二次没有
router.post('/api/product/fileUpload', ProductController.postProductFiles)

// 发布（上传）商品信息
router.post('/api/product/saveProduct', isAuth, ProductController.postProduct)

// 删除商品
router.delete('/api/product/deleteProduct', isAuth, ProductController.deleteProduct)

router.post('/api/product/count',isAuth,  ProductController.getAllProductCount)


// // ***************************** 前台 ***************************** 
// 按照条件展示商品
router.post('/api/front/productlist',ProductFrontController.getProductlistFront)

// 按照商品的productId(就是_id)查找商品详情
router.get('/api/productdetail/:productId',ProductFrontController.getProductdetail)

// 获取商品展示的用户信息
router.get('/api/product/users',ProductFrontController.getUsersdetail)

// 点击想要商品，对应商品的hotScore+1
router.post('/api/want/:productId', isAuth, ProductFrontController.wantProduct)

// 取消想要商品，对应商品的hotScore-1
router.post('/api/wantno/:productId', isAuth, ProductFrontController.wantNoProduct)

// 获取用户的想要列表
// router.get('/api/want/list',ProductFrontController.getWantList)




//向外暴露
module.exports = router;