const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const config = require('../../config/default')
// 加密的幂次
const SALT_WORK_FACTOR = config.bcryptSalt; // 默认 10

class AdminUserController{
    constructor() { }

    // 首页左侧商品分类
    async getUserList(req, res){  
        const { pageNo, pageSize } = req.params
        const username = req.query.username.trim()

        // 分页
        // 从数据库里截取 start到start+pageSize 的数据
        const start = (pageNo - 1) * pageSize

        const hasUsernameField = ( username.length !== 0) ? { username: username } : {}
        let totalCount = 0 // 总数据条数
        let userlist = []

        if (hasUsernameField) {   
            // console.log('admin',typeof username)
            totalCount = await User.find(hasUsernameField).count(); // 总数据条数
            // 按照分类名、当前的排序方式，分页，返回用户列表数据
            userlist = await User.find(hasUsernameField).skip(start).limit(pageSize)
        }  
        const totalPages = Math.ceil(totalCount / pageSize); // 一共显示多少页

        
        // 把所有用户的密码隐藏
        userlist.forEach(user=>user.password = '******')
        // console.log( pageNo, pageSize,userlist.length)
        if (userlist) {
            res.json({
                msg: '操作成功',
                code: 200,
                data: {
                    totalPages: totalPages,
                    pageNo: pageNo,
                    totalCount: totalCount,
                    pageSize: pageSize,
                    userlist: userlist
                },
                ok: true
            })
        }

    } 
    async addUser(req,res){
        // console.log(req.body)
        let { username, password,phone,studentnumber,place } = req.body
        if(!phone) phone=''
        if(!studentnumber) studentnumber=''
        if(!place) place=''
   
        // console.log(req.body.place) 
        User.findOne({ username: username }, (err, user) => {
        if (err) return console.log(err);
        if (user) {
            // 用户名已经存在，发出错误信息
            // ok状态，如果是false,那么前台可以根据这个状态打印出一定信息
            res.json({
            msg: '操作失败，用户名已存在',
            code: 409,
            data: null,
            ok: false
            })
        } else {
            // 创建用户数据
            const user = new User({
            username: username,
            password: password,
            studentnumber: studentnumber,
            place: place,
            phone: phone,
            admin: false,
            routes: []
            });
            // 密码加密
            bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return console.log(err);
                user.password = hash;
                user.save(err => {
                if (err) return console.log(err);
                })
                res.json({
                msg: '操作成功',
                code: 200,
                data: null,
                ok: true
                })
            })
            })
        }
        })
    }
    async updateUser(req,res){
        // console.log(req.body)
        let { username, phone,studentnumber, place} = req.body
        User.findById(req.body._id, (err, user) => {
            // console.log(user)
            if (err) return console.log(err)
            if (user) {
                user.username = username
                user.phone = phone
                user.studentnumber = studentnumber
                user.place = place
            
                user.save((err) => {
                    if (err) return console.log(err)
                    res.json({
                        msg: '操作成功',
                        code: 200,
                        data: null,
                        ok: true
                    })
                })
                
            }
   
        })
    }
    async removeOneUser(req,res){
        const id = req.params.id
        User.findByIdAndRemove(id, (err, user) =>{
            if (err) return console.log(err)
            // console.log('删除成功')
            res.json({
                msg: '删除成功',
                code: 200,
                data: null,
                ok: true
            })
        })
    }
    async removeAllUser(req,res){
        // console.log(req.body)
        const ids = req.body
        console.log(ids)
        ids.forEach(id=>{
            User.findByIdAndDelete(id,err=>{
                if (err) return console.log(err)
            })
        })
        res.json({
            msg: '删除成功',
            code: 200,
            data: null,
            ok: true
        })
        
    }
    

    
}

module.exports = new AdminUserController();