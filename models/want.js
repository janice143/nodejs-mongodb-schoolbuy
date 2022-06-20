const mongoose = require('mongoose')

// want schema 想要（想要某件商品）
const Wantschema = new mongoose.Schema({
    title: String, // 商品的名称
    productId:String, // 区分商品的属性
    // hotScore: Number, // 该商品想要的数量
    usernames: Array, // 想要该商品的用户

});

const Want = mongoose.model('want', Wantschema);
module.exports = Want;






