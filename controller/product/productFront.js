// 前台项目接口
const Product = require("../../models/product");
const Want = require("../../models/want");
const User = require("../../models/user");

class ProductFrontController {
  constructor() {
    this.persistFolder = undefined; // 添加状态下，记录第一次创建文件夹的文件路径
    this.folder = undefined; // 记录图片上传的路径
    this.cnt = 0; // 用来记录当前上传图片数量
    this.isEdit = "false"; // 记录是否处于编辑状态
    this.imgUrl = "";
  }

  // 按条件获取商品，如果没给参数。就显示全部商品
  async getProductlistFront(req, res) {
    // 传给服务器的参数，该参数为一些查找商品的条件，
    // console.log(req.body)
    let { categoryName, keyword, order, pageNo, pageSize } = req.body;
    if (!keyword) keyword = "";
    // console.log(keyword)
    // console.log(categoryName, keyword, order, pageNo, pageSize)
    // 分页
    // 从数据库里截取 start到start+pageSize 的数据
    const start = (pageNo - 1) * pageSize;
    // console.log(order)
    // 升序或者降序 order.split(':')[1]
    // 新品，热门，价格 order.split(':')[0]
    const orderMethod =
      order.split(":")[0] === "1"
        ? "createTime"
        : order.split(":")[0] === "2"
        ? "hotScore"
        : "price";
    const orderSort = order.split(":")[1] === "asc" ? 1 : -1;

    // 按照给定的关键字keyword查找数据库
    const hasCategoryNameField =
      categoryName.length !== 0 && categoryName !== "全部商品"
        ? { categoryName: categoryName }
        : {};
    let totalCount = 0; // 总数据条数
    let productlist = [];
    if (hasCategoryNameField) {
      // 如果没有关键字，也就是没在前台项目的搜索框中输入，那么不需要按照关键字查找
      if (keyword.length === 0) {
        totalCount = await Product.find(hasCategoryNameField).count(); // 总数据条数
        // 按照分类名、当前的排序方式，分页，返回产品列表数据
        // 1 升序，-1 降序
        productlist = await Product.find(hasCategoryNameField)
          .sort({ [orderMethod]: orderSort })
          .skip(start)
          .limit(pageSize);
      } else {
        totalCount = await Product.find(hasCategoryNameField)
          .where("keyword")
          .regex(keyword)
          .count(); // 总数据条数
        // 按照分类名、当前的排序方式，分页，返回产品列表数据
        // 1 升序，-1 降序
        productlist = await Product.find(hasCategoryNameField)
          .where("keyword")
          .regex(keyword)
          .sort({ [orderMethod]: orderSort })
          .skip(start)
          .limit(pageSize);
      }

      const totalPages = Math.ceil(totalCount / pageSize); // 一共显示多少页

      // console.log(productlist)
      // 展示商品的想要状态
      const username = req.session.username;
      // 根据用户名查找商品，获取id
      // console.log(username)

      const wantList = await Want.find({
        usernames: { $elemMatch: { $eq: username } },
      });
      const wantId = wantList.map((want) => want.productId);
      // console.log(wantId)

      if (productlist) {
        res.json({
          msg: "操作成功",
          code: 200,
          data: {
            totalPages: totalPages,
            pageNo: pageNo,
            totalCount: totalCount,
            pageSize: pageSize,
            productlist: productlist,
            wantId: wantId,
          },
          ok: true,
        });
      }
    }
  }
  // 获取四个关键词分类的数量
  async getKeyCat(req, res) {
    // 传给服务器的参数，该参数为一些查找商品的条件，
    const keyList = ["食品饮料", "图书办公", "服饰鞋靴", "车"];
    const keyCount = [
      {
        name: "食品",
        count: 0,
        icon: "icon-shuiguo",
        type: { category: "食品饮料" },
      },
      {
        name: "书籍",
        count: 0,
        icon: "icon-shu1",
        type: { category: "图书办公" },
      },
      {
        name: "衣服",
        count: 0,
        icon: "icon-shenghuoyongpin-",
        type: { category: "服饰鞋靴" },
      },
      {
        name: "车类",
        count: 0,
        icon: "icon-xiaomotuochexiaodianche",
        type: { keyword: "车" },
      },
    ];
    keyCount[0].count = await Product.find({
      categoryName: keyList[0],
    }).count(); // 总数据条数
    keyCount[1].count = await Product.find({
      categoryName: keyList[1],
    }).count(); // 总数据条数
    keyCount[2].count = await Product.find({
      categoryName: keyList[2],
    }).count(); // 总数据条数
    keyCount[3].count = await Product.find()
      .where("keyword")
      .regex(keyList[3])
      .count(); // 总数据条数

    res.json({
      msg: "操作成功",
      code: 200,
      data: {
        keyCount: keyCount,
      },
      ok: true,
    });
  }
  // 获取首页的promain
  async getProdmain(req, res) {
    const orders = req.body;
    const orderMethod = orders.map((order) => {
      order.split(":")[0] === "1"
        ? "createTime"
        : order.split(":")[0] === "2"
        ? "hotScore"
        : "price";
    });
    // const orderSort = orders.map((order) => {
    //   order.split(":")[1] === "asc" ? 1 : -1;
    // });
    const start = 0,
      pageSize = 10;
    const prodmainList = Array.from({ length: orders.length }, () => []);
    // 一次性查找数据库，然后操作数组筛选出要的结果
    const allProducts = await Product.find();

    prodmainList[0] = allProducts
      .sort((a, b) => parseInt(b.createTime) - parseInt(a.createTime))
      .filter((prod, index) => index < 10);
    prodmainList[1] = allProducts
      .sort((a, b) => Number(b.hotScore) - Number(a.hotScore))
      .filter((prod, index) => index < 10);
    prodmainList[2] = allProducts
      .sort((a, b) => Number(a.price) - Number(b.price))
      .filter((prod, index) => index < 10);
    // console.log(prodmainList[0])
    res.json({
      msg: "操作成功",
      code: 200,
      data: {
        prodmainList: prodmainList,
      },
      ok: true,
    });
  }
  // 获取首页的prodleft
  async getProdleft(req, res) {
    const categoryNames = [
      {
        name:"图书办公",
        keyword:["考研资料","四六级","教资","教材书","文具"],
        counts:[],
        icon: "icon-shu"
      },
      {
        name:"数码电器",
        keyword:["手机","电脑","耳机","吹风机"],
        counts:[],
        icon: "icon-shouji"
      },
      {
        name:"珠宝装饰",
        keyword:["项链","手镯","戒指","眼镜框","耳钉"],
        counts:[],
        icon: "icon-xianglian-"
      },
      {
        name:"玩具乐器",
        keyword:["吉他","电子琴","毛绒玩具","教材书"],
        counts:[],
        icon: "icon-wanju"
      },
      {
        name:"票务娱乐",
        keyword:["电影票","演出票"],
        counts:[],
        icon: "icon-dianyingpiao"
      },
      {
        name:"居家日用",
        keyword:["纸巾","鞋柜","椅子","墙画"],
        counts:[],
        icon: "icon-riyongbaihuo"
      },
      {
        name:"个护美妆",
        keyword:["面膜","洗面奶","口红","眼影","洗发水"],
        counts:[],
        icon: "icon-huabanfuben"
      },

      {
        name:"服饰鞋靴",
        keyword:["裙子","T恤","衬衫","外套","鞋子"],
        counts:[],
        icon: "icon-Txu"
      },
      {
        name:"箱包",
        keyword:["女包","单肩包","双肩包","手提包"],
        counts:[],
        icon: "icon-zihangche"
      },
      {
        name:"食品饮料",
        keyword:["方便面","牛奶","咖啡","零食大礼包","饼干"],
        counts:[],
        icon: "icon-jinkoushipin"
      },
      {
        name:"运动户外",
        keyword:["自行车","电动车","羽毛球","乒乓球"],
        counts:[],
        icon: "icon-zihangche"
      }
    ];
    // 某一分类的商品的关键词的集合：选前5个
    // 一次性查找数据库，然后操作数组筛选出要的结果
    const allProducts = await Product.find();

    // 总分类的商品总数
     categoryNames.forEach(cat=>{
      cat.counts[0]=allProducts.filter(prod=>prod.categoryName === cat.name).length
    } )
    
    // 每个分类的商品总数
    categoryNames.forEach(cat=>{
      for(let i=0;i<cat.keyword.length;i++){
        cat.counts.push(allProducts.filter(prod=>prod.keyword.includes(cat.keyword[i])).length)
      }
    })
    res.json({
      msg: "操作成功",
      code: 200,
      data: {
        categoryNames
      },
      ok: true,
    });
  }
  // 获取所有用户的信息，用于商品信息的展示
  async getUsersdetail(req, res) {
    // console.log(11)
    User.find({}).then((users) => {
      if (!users) {
        return res.json({
          msg: "操作失败",
          code: 401,
          data: null,
          ok: false,
        });
      }
      // admin用户不显示
      const userlist = users.filter((user) => user.username !== "admin");

      // 修改密码, password不能明文出现
      userlist.forEach((user) => (user.password = "******"));
      // 用户手机号，学号也隐藏
      userlist.forEach((user) => (user.phone = "******"));
      userlist.forEach((user) => (user.studentnumber = "******"));
      // admin隐藏
      userlist.forEach((user) => (user.admin = "******"));

      // // console.log(req.user)
      res.json({
        msg: "操作成功",
        code: 200,
        data: userlist,
        ok: false,
      });
    });
  }

  // 按照商品的productId(就是_id)查找商品详情
  async getProductdetail(req, res) {
    const productId = req.params.productId;
    // 按照商品_id来查找数据库
    Product.findById(productId, (err, detail) => {
      // console.log(detail)
      if (err) console.log(err);
      if (detail) {
        res.json({
          msg: "操作成功",
          code: 200,
          data: detail,
          ok: true,
        });
      }
    });
  }
  // 想要商品
  async wantProduct(req, res) {
    // console.log(req.params,req.body)

    const id = req.params.productId;
    // product 模型上hotScore+1
    Product.findById(id, (err, product) => {
      if (err) return console.log(err);
      if (product) {
        // console.log(product)
        product.hotScore += 1;
        product.save((err) => {
          if (err) return console.log(err);
        });
      }
    });
    // want 模型上添加该商品
    const title = req.body.title,
      username = req.session.username;
    Want.findOne({ productId: id }, (err, product) => {
      if (err) return console.log(err);
      if (product) {
        // 商品已经存在，直接修改
        product.title = title;
        product.productId = id;
        product.usernames.push(username);

        product.save((err) => {
          if (err) return console.log(err);
        });
      } else {
        // 创建商品want数据
        const product = new Want({
          title: title,
          productId: id,
          usernames: [].concat(username),
        });
        product.save((err) => {
          if (err) return console.log(err);
        });
      }
    });
    res.json({
      msg: "操作成功",
      code: 200,
      data: null,
      ok: true,
    });
  }
  // 取消想要
  async wantNoProduct(req, res) {
    // console.log(req.params,req.body)
    const id = req.params.productId;
    // product 模型上hotScore-1
    Product.findById(id, (err, product) => {
      if (err) return console.log(err);
      if (product) {
        // console.log(product)
        product.hotScore -= 1;
        if (product.hotScore < 0) {
          product.hotScore = 0
        }
        product.save((err) => {
          if (err) return console.log(err);
        });
      }
    });
    // want 模型上去掉想要该商品的用户
    const title = req.body.title,
      username = req.session.username;
      console.log(username)
    Want.findOne({ productId: id }, (err, product) => {
      if (err) return console.log(err);
      if (product) {
        // 商品已经存在，直接修改
        product.title = title;
        product.productId = id;
        // 删除用户名
        const usernames = new Set(product.usernames);
        usernames.delete(username);
        product.usernames = [...usernames];

        product.save((err) => {
          if (err) return console.log(err);
        });
      }
    });
    res.json({
      msg: "操作成功",
      code: 200,
      data: null,
      ok: true,
    });
  }
}

module.exports = new ProductFrontController();
