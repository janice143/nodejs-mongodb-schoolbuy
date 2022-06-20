// 前台项目接口
const Product = require('../../models/product')
const Want = require('../../models/want')
const User = require('../../models/user')

class ProductFrontController {
    constructor() {
        this.persistFolder = undefined // 添加状态下，记录第一次创建文件夹的文件路径
        this.folder = undefined // 记录图片上传的路径
        this.cnt = 0 // 用来记录当前上传图片数量
        this.isEdit = 'false' // 记录是否处于编辑状态
        this.imgUrl = ''
 
    }

    // 按条件获取商品，如果没给参数。就显示全部商品
    async getProductlistFront(req, res) {
        
        // 传给服务器的参数，该参数为一些查找商品的条件，
        // console.log(req.body)
        let { categoryName, keyword, order, pageNo, pageSize } = req.body
        if(!keyword) keyword=''
        // console.log(keyword)
        // console.log(categoryName, keyword, order, pageNo, pageSize)
        // 分页
        // 从数据库里截取 start到start+pageSize 的数据
        const start = (pageNo - 1) * pageSize
        // console.log(order)
        // 升序或者降序 order.split(':')[1]
        // 新品，热门，价格 order.split(':')[0]
        const orderMethod = order.split(':')[0] === '1' ? "createTime" : order.split(':')[0] === '2' ? "hotScore" : "price"
        const orderSort = order.split(':')[1] === 'asc' ? 1 : -1

        // 按照给定的关键字keyword查找数据库
        const hasCategoryNameField = (categoryName.length !== 0 && categoryName !== "全部商品") ? { categoryName: categoryName } : {}
        let totalCount = 0 // 总数据条数
        let productlist = []
        if (hasCategoryNameField) {
            // 如果没有关键字，也就是没在前台项目的搜索框中输入，那么不需要按照关键字查找
            if (keyword.length === 0) {
                totalCount = await Product.find(hasCategoryNameField).count(); // 总数据条数
                // 按照分类名、当前的排序方式，分页，返回产品列表数据
                // 1 升序，-1 降序
                productlist = await Product.find(hasCategoryNameField).sort({ [orderMethod]: orderSort }).skip(start).limit(pageSize)
            } else {
                totalCount = await Product.find(hasCategoryNameField).where('keyword').regex(keyword).count(); // 总数据条数
                // 按照分类名、当前的排序方式，分页，返回产品列表数据
                // 1 升序，-1 降序
                productlist = await Product.find(hasCategoryNameField).where('keyword').regex(keyword).sort({ [orderMethod]: orderSort }).skip(start).limit(pageSize)
            }

            const totalPages = Math.ceil(totalCount / pageSize); // 一共显示多少页

            // console.log(productlist)
            // 展示商品的想要状态
            const username = req.session.username
            // 根据用户名查找商品，获取id

            const wantList = await Want.find({usernames:{ $elemMatch: { $eq: username } }})
            const wantId = wantList.map(want=>want.productId)
            // console.log(wantId)
          
            if (productlist) {
                res.json({
                    msg: '操作成功',
                    code: 200,
                    data: {
                        totalPages: totalPages,
                        pageNo: pageNo,
                        totalCount: totalCount,
                        pageSize: pageSize,
                        productlist: productlist,
                        wantId:wantId
                    },
                    ok: true
                })
            }


        }

    }
    // 获取所有用户的信息，用于商品信息的展示
    async getUsersdetail(req,res){
        // console.log(11)
        User.find({}).then((users) => {
            if (!users) {
              return res.json({
                msg:'操作失败',
                code: 401,
                data: null,
                ok:false
              })
            }
            // admin用户不显示
            const userlist = users.filter(user=>user.username !== 'admin')

            // 修改密码, password不能明文出现     
            userlist.forEach(user=>user.password = '******')
            // 用户手机号，学号也隐藏
            userlist.forEach(user=>user.phone = '******')
            userlist.forEach(user=>user.studentnumber = '******')
            // admin隐藏
            userlist.forEach(user=>user.admin = '******')
            
            
            // // console.log(req.user)
            res.json({
              msg:'操作成功',
              code: 200,
              data: userlist,
              ok:false
            })
          })
    }

    // 按照商品的productId(就是_id)查找商品详情
    async getProductdetail(req, res) {
        const productId = req.params.productId
        // 按照商品_id来查找数据库
        Product.findById(productId, (err, detail) => {
            // console.log(detail)
            if (err) console.log(err)
            if (detail) {
                res.json({
                    msg: '操作成功',
                    code: 200,
                    data: detail,
                    ok: true
                })
            }
        })
    }
    // 想要商品
    async wantProduct(req,res){
        // console.log(req.params,req.body)
        
        const id = req.params.productId
        // product 模型上hotScore+1
        Product.findById(id,(err,product)=>{
            if (err) return console.log(err)
            if (product) {
                // console.log(product)
                product.hotScore += 1
                product.save((err) => {
                    if (err) return console.log(err)
                })
                
            }
        })
        // want 模型上添加该商品
        const title = req.body.title, username = req.body.username
        Want.findOne({productId:id}, (err, product) => {
            if (err) return console.log(err);
            if (product) {
                // 商品已经存在，直接修改
                product.title = title
                product.productId = id
                product.usernames.push(username)
                
                product.save((err) => {
                    if (err) return console.log(err)
                }) 
            } else {
                // 创建商品want数据
                const product = new Want({
                    title : title,
                    productId : id,
                    usernames : [].concat(username)
                })
                product.save((err) => {
                    if (err) return console.log(err)
                }) 
            }
            
        })
        res.json({
            msg: '操作成功',
            code: 200,
            data: null,
            ok: true
        })
    }
    // 取消想要
    async wantNoProduct(req,res){
        // console.log(req.params,req.body)
        const id = req.params.productId
        // product 模型上hotScore-1
        Product.findById(id,(err,product)=>{
            if (err) return console.log(err)
            if (product) {
                // console.log(product)
                product.hotScore -= 1
                if(product.hotScore < 0){
                    res.json({
                        msg: '操作失败',
                        code: 401,
                        data: null,
                        ok: false
                    })
                }
                product.save((err) => {
                    if (err) return console.log(err)
                })
                
            }
        })
        // want 模型上去掉想要该商品的用户
        const title = req.body.title, username = req.body.username
        Want.findOne({productId:id}, (err, product) => {
            if (err) return console.log(err);
            if (product) {
                // 商品已经存在，直接修改
                product.title = title
                product.productId = id
                // 删除用户名
                const usernames = new Set(product.usernames)
                usernames.delete(username)
                product.usernames = [...usernames]
                
                product.save((err) => {
                    if (err) return console.log(err)
                }) 
            }
            
        })
        res.json({
            msg: '操作成功',
            code: 200,
            data: null,
            ok: true
        })
    }
}

module.exports = new ProductFrontController();