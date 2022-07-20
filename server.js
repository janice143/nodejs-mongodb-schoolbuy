const express = require('express')
// 创建一个express实例
const app = express()
const bodyParser = require('body-parser')
const router = require('./routes/index.js')
const session=require("express-session")
const passport = require('passport')
const config = require('./config/default.js');

// 连接mongodb数据库
const connect = require('./mongodb/connect.js')
connect()


// view引擎设置
app.set('view engine','ejs'); 
// 设置public文件夹
app.use(express.static('public')); 


// body parser中间件 
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json./models/getCategoryList
app.use(bodyParser.json())

// 配置session，用来存储用户是否是超级管理员状态
// app.use(session({
//     secret: 'isAdmin',   // 加密信息，可以随便写
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: !true }
// }))

app.use(session({
    name: config.session.name,
    secret: config.session.secret,  
    resave: true,
    saveUninitialized: false,
    cookie: config.session.cookie,

}))
// 初始化 passport 解析 token
require('./common/passport')(passport);
// 初始化调用 passport
app.use(passport.initialize());

// ---- CORS setHeader 跨域设置 ----
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
})


// 设置路由
router(app)


const PORT = process.env.PORT || 3000;

app.listen(PORT)