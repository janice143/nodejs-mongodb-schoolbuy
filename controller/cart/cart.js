const Product = require('../../models/product')
const Cart = require('../../models/cart')

class CartController {
    constructor() { }

    // 加入购物车
    async addTocart(req, res) {
        // console.log(req.params,req.body)
        const id = req.params.productId
        // cart 模型上添加该商品
        const title = req.body.title, username = req.user.username
        Cart.findOne({ productId: id }, (err, product) => {
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
                const product = new Cart({
                    title: title,
                    productId: id,
                    usernames: [].concat(username)
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
    // 获取购物车列表
    async getCartList(req, res) {
        const username = req.user.username
       
        // 根据用户名查找商品，获取商品id
        // console.log(username)
        const cartList = await Cart.find({ usernames: { $elemMatch: { $eq: username } } })
        const cartId = cartList.map(product => product.productId)
        // 根据id获取商品信息
        try {
            const products = await Product.find().where('_id').in(cartId).exec()
            res.json({
                msg: '操作成功',
                code: 200,
                data: products,
                ok: true
            })
        } catch {
            res.json({
                msg: '操作失败',
                code: 401,
                data: null,
                ok: true
            })
        }

    }
    async deleteCart(req,res){
        const id = req.params.productId
        
        // cart 模型上去掉想要该商品的用户
        const username = req.user.username
   
        Cart.findOne({productId:id}, (err, product) => {
            if (err) return console.log(err);
            if (product) {
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

module.exports = new CartController();