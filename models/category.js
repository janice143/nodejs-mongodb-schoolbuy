const mongoose = require('mongoose')

// category schema
const CategorySchema = new mongoose.Schema({
    categoryName: String,
    categoryId: Number,
});

const Category = mongoose.model('category', CategorySchema);
module.exports = Category;
