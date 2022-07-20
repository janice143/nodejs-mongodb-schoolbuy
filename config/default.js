module.exports = {
	port: parseInt(process.env.PORT, 10) || 3000,
	SERVICEADDRESS:'http://localhost:3000',
	// SERVICEADDRESS:'http://101.34.27.188:3000',
	url: 'mongodb://localhost:27017/schoolstore',
	// url:'mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb/schoolstore',
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