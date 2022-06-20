const express = require('express')
const router = express.Router() //初始化路由

const AdminUserController = require('../../controller/admin/user')


// 获取所有用户信息
router.get('/api/admin/user/list/:pageNo/:pageSize', AdminUserController.getUserList)

// 添加用户
router.post('/api/admin/user/list/save', AdminUserController.addUser)

// 更新用户信息
router.put('/api/admin/user/list/update', AdminUserController.updateUser)

// 删除用户
router.delete('/api/admin/user/list/remove/:id',AdminUserController.removeOneUser)

// 批量删除
router.delete('/api/admin/user/list/batchRemove',AdminUserController.removeAllUser)

module.exports = router




