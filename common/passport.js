const Strategy = require('passport-jwt').Strategy
const User = require('../models/user')
const ExtractJwt = require('passport-jwt').ExtractJwt
const options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
options.secretOrKey = 'smelly cat' // 这里的secretOrKey需要与生成token时的加密命名一致，此处需注意！！

module.exports = passport => {
    // /**
    //  * @jwt_payload 请求得到的内容
    //  * @done 表示策略结束,返回信息
    //  */
    passport.use(new Strategy(options, (jwt_payload, done) => {
        // console.log(jwt_payload)
        User.findOne({username:jwt_payload.username}).then(user => {
            // console.log(user)
            if (user) {
                return done(null, user)
            }
            return done(null, false, { message: '用户不存在' });
        }).catch(err => {
            console.log(err)
        })
    }))
}
 
 
//  备注：passport 会在接口处使用，将请求携带的token进行解析，然后判断User中是否存在此用户
//       存在则认证成功并将用户返回，否则认证失败

