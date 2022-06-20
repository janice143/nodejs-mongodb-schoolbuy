const mongoose = require('mongoose')

// product schema
const Productchema = new mongoose.Schema({

    imgUrl: String,
    gallery: Array,
    title: String,
    description: String,
    price: Number,
    createTime: String,
    categoryName: String,
    hotScore: Number,
    keyword: Array,
    username:String

});

const Product = mongoose.model('product', Productchema);
module.exports = Product;




