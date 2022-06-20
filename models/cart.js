const mongoose = require('mongoose')

// cart schema
const CartSchema = new mongoose.Schema({
    title: String, // 商品的名称
    productId:String, // 区分商品的属性
    // hotScore: Number, // 该商品想要的数量
    usernames: Array, // 加入购物车的用户
});

const Cart = mongoose.model('cart', CartSchema);
module.exports = Cart;
