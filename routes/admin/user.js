const express = require('express')
const router = express.Router() //初始化路由
const role = require('../../middlewares/role')
const isAdmin = role.isAdmin
const AdminUserController = require('../../controller/admin/user')


// 获取所有用户信息
router.get('/api/admin/user/list/:pageNo/:pageSize', isAdmin, AdminUserController.getUserList)

// 添加用户
router.post('/api/admin/user/list/save', isAdmin, AdminUserController.addUser)

// 更新用户信息，前台也可以更新用户信息
router.put('/api/admin/user/list/update', AdminUserController.updateUser)

// 删除用户
router.delete('/api/admin/user/list/remove/:id', isAdmin, AdminUserController.removeOneUser)

// 批量删除
router.delete('/api/admin/user/list/batchRemove', isAdmin, AdminUserController.removeAllUser)

// 获取用户分布信息
router.get('/api/admin/user/place', isAdmin, AdminUserController.getUserPlace)

// 获取新增用户和总用户
router.post('/api/user/count',isAdmin, AdminUserController.getAllUserCount)


module.exports = router




