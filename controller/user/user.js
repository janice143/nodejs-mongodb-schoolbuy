const Token = require('../../common/jwt')
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const config = require('../../config/default')
// 加密的幂次
const SALT_WORK_FACTOR = config.bcryptSalt; // 默认 10

class UserController {
  constructor() { }
  // 用户登录
  async login(req, res, next) {

    // console.log('test',req.body)
    const { username, password, codeNumber} = req.body
    // 验证 验证码是否正确
    const cap = req.session.cap;
		if (!cap) {
			console.log('验证码失效')
      res.json({
        msg: '验证码失效',
        code: 401,
        data: null,
        ok: false
      })
      return
		}
    if (cap.toString() !== codeNumber.toString()) {
      res.json({
        msg: '验证码不正确',
        code: 401,
        data: null,
        ok: false
      })
      return
    }
    // 验证用户是否存在，存在是否密码正确
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        console.log('出现错误');
      }
      if (!user) {
        res.json({
          msg: '用户不存在',
          code: 401,
          data: null,
          ok: false
        })
        return console.log('用户不存在');
      }
      // 用户名已经找到，验证密码是否正确
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return console.log(err);
        if (isMatch) {
          // 把admin信息存在session中
          // req.session.admin = user.admin
          // 把username的信息存在session中
          req.session.username = user.username

          // 匹配成功,生成token
          const rule = {
            username: user.username
          }
          const token = 'Bearer ' + Token.encrypt(rule, 60 * 60) // 60 * 60s 秒
          res.json({
            msg: '操作成功',
            code: 200,
            data: { token: token },
            ok:true
          })
        } else {
          res.json({
            msg: '密码错误',
            code: 401,
            data: null,
            ok: false
          })
          return console.log('密码错误');
        }
      })
    })

  }
  // 用户注册
  async register(req, res, next) {
    const { username, phone, studentnumber, place, password } = req.body
    User.findOne({ username: username }, (err, user) => {
      if (err) return console.log(err);
      if (user) {
        // 用户名已经存在，发出错误信息
        // ok状态，如果是false,那么前台可以根据这个状态打印出一定信息
        res.json({
          msg: '操作失败，用户名已存在',
          code: 409,
          data: null,
          ok: false
        })
      } else {
        // 创建用户数据
        const user = new User({
          username: username,
          password: password,
          studentnumber: studentnumber,
          place: place,
          phone: phone,
          admin: false,
          createTime: Date.now(),
          routes: []
          // admin: true,
          // routes: ['User','List','Place']
        });
        // 密码加密
        bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return console.log(err);
            user.password = hash;
            user.save(err => {
              if (err) return console.log(err);
            })
            res.json({
              msg: '操作成功',
              code: 200,
              data: null,
              ok: true
            })
          })
        })
      }
    })
  }

  // 完善用户信息
  async complete(req,res){
    const { username, phone, studentnumber, place } = req.body
    User.findOne({ username: username }, (err, user) => {
      if (err) return console.log(err);
      if (user) {
        // 用户名已经存在，发出错误信息
        user.phone = phone
        user.studentnumber = studentnumber
        user.place = place
        user.save(err => {
          if (err) return console.log(err);
        })
        // ok状态，如果是false,那么前台可以根据这个状态打印出一定信息
        res.json({
          msg: '用户信息已完善',
          code: 200,
          data: null,
          ok: true
        })
      }
    })
  }

  // 获取用户信息
  async getUserInfo(req, res) {
    // console.log(req.user)
    User.findOne({ username: req.user.username }).then((user) => {
      if (!user) {
        return res.json({
          msg:'操作失败',
          code: 401,
          data: null,
          ok:false
        })
      }
      
      req.user.password = '******' // user 为 passport 执行 done() 所传入的信息，注意password不能明文出现     
      // console.log(req.user)
      res.json({
        msg:'操作成功',
        code: 200,
        data: req.user,
        ok:false
      })
    })
  }

  // 退出登录
  async logout(req,res,next){
    req.session.username = ''
    res.json({
      msg:'操作成功',
      code:200,
      data:null,
      ok:true
    })   
  }
}



module.exports = new UserController();
