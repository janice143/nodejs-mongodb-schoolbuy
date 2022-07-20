const User = require('../../models/user')
const Product = require('../../models/product')
const bcrypt = require('bcryptjs')
const config = require('../../config/default');
const { use } = require('passport');
// 加密的幂次
const SALT_WORK_FACTOR = config.bcryptSalt; // 默认 10

class AdminUserController {
    constructor() {

    }

    // 获取用户管理的数据
    async getUserList(req, res) {
        const { pageNo, pageSize } = req.params
        const username = req.query.username.trim()

        // 分页
        // 从数据库里截取 start到start+pageSize 的数据
        const start = (pageNo - 1) * pageSize

        const hasUsernameField = (username.length !== 0) ? { username: username } : {}
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
        userlist.forEach(user => user.password = '******')
        // console.log( pageNo, pageSize,userlist.length)
        
        // 获取每个用户的商品数据
        const allProducts = await Product.find({})
        const userlist1 = userlist.map((user) => {
            // console.log(user)
            return { 
                username: user.username,
                studentnumber: user. studentnumber,
                place: user.place,
                phone: user.phone,
                _id: user._id,
                userGoods: allProducts.filter(pro=>pro.username === user.username) 
            }
        })

        if (userlist) {
            res.json({
                msg: '操作成功',
                code: 200,
                data: {
                    totalPages: totalPages,
                    pageNo: pageNo,
                    totalCount: totalCount,
                    pageSize: pageSize,
                    userlist: userlist1,
                },
                ok: true
            })
        }

    }
    async getUserPlace(req,res){
        // 每个寝室对应的人数
        const places = ["桃源公寓","杏园公寓","初阳公寓","桂苑公寓","启明公寓","留学生公寓"]
        const placesEn = ["taoyuan","xingyuan","chuyang","guiyuan","qiming","liuxuesheng"]
        const userlist = await User.find({})
        const value = {}
        places.forEach((place,idx)=>{
            value[placesEn[idx]] = userlist.filter(user=>user.place === place).length            
        })
        if(JSON.stringify(value).length > 0){
            res.json({
                msg: '成功',
                code: 200,
                data: value,
                ok: true
            })
        }else{
            res.json({
                msg: '失败',
                code: 401,
                data: null,
                ok: false
            })
        }

    }
     // 获取总用户数和今日新增用户数
     async getAllUserCount(req,res){
        let allUserCount = 0, todayUserCount = 0
        // console.log(req.body)
        
        // 今日新增用户
        // 时间有个范围值，传过来的时间是年月日，，所以范围是2022.7.18,0:00-2022.7.19,0:00
        // new Date(new Date(2022, 6, 18, 0, 0, 0).getTime()+1000*60*60*24)
        const date = req.body
        const time1 = new Date(date.year, date.month, date.day, 0, 0, 0).getTime()
        const time2 = time1+1000*60*60*24
        todayUserCount = await User.find({}).where('createTime').gt(time1).lt(time2).count()
        
        // 总用户
        allUserCount = await User.find({}).count()
        res.json({
            msg: '成功',
            code: 200,
            data: {allUserCount:allUserCount,todayUserCount:todayUserCount},
            ok: true
        })
    }

    async addUser(req, res) {
        // console.log(req.body)
        let { username, password, phone, studentnumber, place } = req.body
        if (!phone) phone = ''
        if (!studentnumber) studentnumber = ''
        if (!place) place = ''

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
                    createTime: Date.now(),
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
    async updateUser(req, res) {
        // console.log(req.body)
        let { username, phone, studentnumber, place } = req.body
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
    async removeOneUser(req, res) {
        const id = req.params.id
        User.findByIdAndRemove(id, (err, user) => {
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
    async removeAllUser(req, res) {
        // console.log(req.body)
        const ids = req.body
        // console.log(ids)
        ids.forEach(id => {
            User.findByIdAndDelete(id, err => {
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