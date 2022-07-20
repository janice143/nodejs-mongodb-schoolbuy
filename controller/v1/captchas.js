'use strict';
// 验证码
const captchapng = require('captchapng')
class Captchas {
	constructor(){

	}
	//验证码
	async getCaptchas(req, res, next){
    	const cap = parseInt(Math.random()*9000+1000);
    	const p = new captchapng(80,30, cap);
        p.color(0, 0, 0, 0); 
        p.color(80, 80, 80, 255);
        const base64 = p.getBase64();
		req.session.cap = cap // 把cap的信息存在session中
		res.json({
            msg: '操作成功',
            code: 200,
            data: { code: 'data:image/png;base64,' + base64 },
            ok:true
		})
	}
}

module.exports = new Captchas()