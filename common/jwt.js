// jwt 鉴权相关，生成token，校验token的方法

const jwt = require('jsonwebtoken');
const SECRET = 'smelly cat'

const Token = {
    //  生成
    encrypt: (data, time) => { //data加密数据 ，time过期时间  60 * 30s（也就是30分）
        return jwt.sign(data, SECRET, { expiresIn: time })
    },
    // 解析
    decrypt: (token) => {
        try {
            const data = jwt.verify(token, 'token');
            return {
                token: true
            };
        } catch (err) {
            return {
                token: false,
                data: err
            }
        }
    }
}
module.exports = Token;
