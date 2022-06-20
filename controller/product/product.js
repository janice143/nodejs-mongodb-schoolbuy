//  后台管理项目接口

const Product = require('../../models/product')
const Category = require('../../models/category')
const Busboy = require('busboy')
const fs = require('fs-extra')
const config = require('../../config/default.js');

class ProductController {
    constructor() {
        this.persistFolder = undefined // 添加状态下，记录第一次创建文件夹的文件路径
        this.folder = undefined // 记录图片上传的路径
        this.cnt = 0 // 用来记录当前上传图片数量
        this.isEdit = 'false' // 记录是否处于编辑状态
        this.imgUrl = ''
        // this.spuImageList = [] // 产品图片列表，是一个对象数组，name和url属性
        this.postProductFiles = this.postProductFiles.bind(this)
        this.postProduct = this.postProduct.bind(this)
    }
    // 创建文件夹
    createFolder(folder) {
        fs.mkdirSync(folder);
        return folder
    }

    // 后台：按条件获取商品，如果没给参数。就显示全部商品
    async getProductlist(req, res) {
        // 传给服务器的参数，该参数为一些查找商品的条件，
        // console.log(req.body)
        const username = req.session.username
        // console.log(username)

        const { categoryName, pageNo, pageSize } = req.body

        // 分页
        // 从数据库里截取 start到start+pageSize 的数据
        const start = (pageNo - 1) * pageSize

        const hasCategoryNameField = (categoryName.length !== 0 && categoryName !== "全部商品") ? { categoryName: categoryName } : {}
        let totalCount = 0 // 总数据条数
        let productlist = []
        if (hasCategoryNameField) {
            // 根据用户名查询商品。用户名是admin，那么查询所有商品
            if(username === 'admin'){
                // console.log('admin',typeof username)
                totalCount = await Product.find(hasCategoryNameField).count(); // 总数据条数
                // 按照分类名、当前的排序方式，分页，返回产品列表数据
                productlist = await Product.find(hasCategoryNameField).skip(start).limit(pageSize)
            }else{
                // 用户名是其他，按照用户名找商品  where('name.last').equals('Ghost').
                totalCount = await Product.find(hasCategoryNameField).where('username').equals(username).count(); // 总数据条数
                // 按照分类名、当前的排序方式，分页，返回产品列表数据
                productlist = await Product.find(hasCategoryNameField).where('username').equals(username).skip(start).limit(pageSize)
            }

            const totalPages = Math.ceil(totalCount / pageSize); // 一共显示多少页

            // console.log(productlist)
            if (productlist) {
                res.json({
                    msg: '操作成功',
                    code: 200,
                    data: {
                        totalPages: totalPages,
                        pageNo: pageNo,
                        totalCount: totalCount,
                        pageSize: pageSize,
                        productlist: productlist
                    },
                    ok: true
                })
            }
    
            
        } 

    }

    // 上传商品图片
    async postProductFiles(req, res, next) {
        // console.log(req)

        const busboy = Busboy({ headers: req.headers })

        // 监听请求中的字段，准确来说是获取elementUI的data属性额外带过来的参数，在前台我命名的data属性是folder,count对象，文件夹名称,文件数量
        // 如果传过来的folder不是undefined，那么说明已经改产品已经有图片上传了，那么找到该文件夹即可
        // 如果是undefined，那么新建文件夹
        busboy.on('field', (name, val, info) => {
            // console.log(`Field [${name}]: value: %j`, val)

            // 每次上传都会重新赋值folder，
            if (name === 'folder') this.folder = val.length !== 0 ? './public/uploadImgs/' + val : undefined
            if (name === 'count') this.cnt = +val // 用+号把val变成number
            if (name === 'isEdit') this.isEdit = val // 注意这里不在是boolean，而是字符串

        })
        busboy.on('file', (name, file, info) => {
            // console.log(11111,this.folder,this.cnt)

            // console.log(typeof this.cnt)
            // 如果文件数量为0，说明这时候是第一次上传，那么就要新建文件夹
            if (this.cnt === 0) {
                // console.log('第一次上传',this.cnt)
                // console.log('是否是编辑状态',this.isEdit)
                this.folder = this.createFolder('./public/uploadImgs/' + Date.now())
                this.persistFolder = this.folder

            } else {
                // console.log('已经有文件上传了',this.cnt)
                // console.log('是否是编辑状态',this.isEdit)
                // console.log(this.folder)
                // 已经有文件上传有两种情况： 1 编辑状态，； 2 添加状态
                // 添加状态，用第一个文件的文件夹
                if (this.isEdit === 'false') this.folder = this.persistFolder
            }
            // console.log(this.persistFolder,this.folder)
            const suffix = info.filename.split('.')[1], randonNum = Math.random().toString(36).slice(2, 7)
            // 文件名： 文件夹名称_随机数.后缀
            const filenm = this.folder.split('/')[this.folder.split('/').length - 1] + '_' + randonNum + '.' + suffix // 文件名

            // 保存文件到指定文件夹 ./public/uploadImgs/1654786862647/1654786862647_0.jpg
            file.pipe(fs.createWriteStream(this.folder + '/' + filenm));//利用fs模块创建可以写入的流,并指定保存路径和名称

            // 产品图片的url
            this.imgUrl = (this.folder + '/' + filenm).replace('./public', config.SERVICEADDRESS)

        });

        busboy.on('close', () => {
            // 
            res.json({
                msg: '图片上传成功',
                code: 200,
                data: this.imgUrl,
                ok: true

            })
        });
        req.pipe(busboy);
    }

    // 上传商品信息
    async postProduct(req, res) {
        // console.log('*************************')
        // console.log(req.body)
        // console.log(req.body.id)

        const { description, price, categoryName } = req.body
        const title = req.body.spuName, keyword = req.body.keywordList.map(item=>item.valueName), images = req.body.spuImageList.map(item => item.imageUrl), username = req.body.owner
        // console.log(keyword,images)
        const imgUrl = images[0] // 主要的图片，在首页显示的图片
        const gallery = images // 图片列表，包括主图
        const folderName = imgUrl.split('/')[imgUrl.split('/').length - 2]
        imgUrl.split('/').slice(-2)[0]
        // 如果是编辑状态，说明spu有id
        if (req.body.id.length > 0) {
            Product.findById(req.body.id, (err, product) => {
                // console.log(detail)
                if (err) return console.log(err)
                if (product) {
                    product.title = title
                    product.description = description
                    product.price = parseFloat(price).toFixed(2)
                    product.categoryName = categoryName
                    product.imgUrl = imgUrl
                    product.keyword = keyword
                    product.gallery = gallery
                    product.username = req.session.username

                    product.save((err) => {

                        if (err) return console.log(err)
                        // 如果前台传过来的图片参数和现有文件夹里的图片数量不同，就要把多余的图片删除
                        // fs.readdir(path[,option],callback)
                        fs.readdir('./public/uploadImgs/' + folderName, (err, data) => {
                            if (err) {
                                console.log(err);
                                return false;
                            } else {
                                // 已有图片的文件名
                                const galleryNames = gallery.map(img => img.split('/')[img.split('/').length - 1])

                                // console.log("读取目录成功！");
                                // console.log(data); // [ '03_tool_multiply.js', 'my_module' ]
                                data.forEach(item => {
                                    // console.log(galleryNames.includes(item))
                                    if (!galleryNames.includes(item)) {
                                        // console.log('yes')
                                        fs.remove('./public/uploadImgs/' + folderName + '/' + item, err => {
                                            if (err) console.log(err);
                                        })
                                    }

                                })

                            };
                        })
                    })

                }
            })
        } else {
            // 如果是添加状态
            const hotScore = 0, createTime = folderName
            const product = new Product({
                title: title,
                description: description,
                price: parseFloat(price).toFixed(2),
                categoryName: categoryName,
                imgUrl: imgUrl,
                hotScore, hotScore,
                createTime: createTime,
                keyword: keyword,
                gallery: gallery,
                username: username
            });
            product.save(function (err) {
                if (err) return console.log(err)
            })
        }

        res.json({
            msg: '操作成功',
            code: 200,
            data: null,
            ok: true
        })
    }

    // 根据id删除商品
    async deleteProduct(req, res) {
        console.log(req.body)
        const {id, imgUrl} = req.body
        // Product.findById(req.params.productId, (err, product) => {

        // })
        // 删除对应id的图片的文件夹
        const path = './public/uploadImgs/' + imgUrl.split('/')[imgUrl.split('/').length - 2]
        fs.remove(path, err => {
            if (err) return console.log(err);
            // 删除数据库对应的product
            Product.findByIdAndRemove(id, function (err, product) {
                if (err) return console.log(err)
                console.log('删除成功')
                res.json({
                    msg: '删除成功',
                    code: 200,
                    data: null,
                    ok: true
                })
            })

        })
    }

}

module.exports = new ProductController();