
const Place = require('../../models/place')

class CategoryController{
    constructor() { }

    // 首页左侧商品分类
    async getCategory(req, res){
        Category.find(function (err, category) {
            if (err) console.log(err)
            res.json({
                msg:'成功',
                code:200,
                data:category,
                ok:true
            })
        })

    }
    
}

module.exports = new CategoryController();