const passport = require('passport')

const isAuth = (req, res, next) => {
  passport.authenticate('jwt', function (err, user, info) {
    if (err) {
      return next(err);
    }
    // console.log(info.name)

    // console.log(111, user) 
    if (user) {
      req.user = user;
      return next();
    } else {
      return res.json({ msg: '权限禁止', code: 401, data:null, ok:false  });
    }
    
  })(req, res, next);
};

module.exports = isAuth


  