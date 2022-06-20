const express = require('express')
const router = express.Router() //初始化路由

const CategoryController = require('../controller/category/category')

// 首页左侧商品分类
router.get('/api/category', CategoryController.getCategory)

//向外暴露
module.exports = router;