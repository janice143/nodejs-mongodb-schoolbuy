module.exports = {
	port: parseInt(process.env.PORT, 10) || 3000,
	SERVICEADDRESS:'http://localhost:3000', // 本地
	// SERVICEADDRESS:'http://101.34.27.188:3000', // 真实服务器
	url: 'mongodb://localhost:27017/schoolstore',
	session: {
		name: 'SID',
		secret: 'SID',
		cookie: {
			httpOnly: true,
	    secure:   false,
	    maxAge:   365 * 24 * 60 * 60 * 1000,
		}
	},
	bcryptSalt: 10,
}