// 处理超级管理员和普通管理员的 认证


exports.isUser = (req,res,next)=>{
    if(req.session.username && req.session.username !== 'admin'){
        next();
    }else{
        res.json({ message: '权限禁止', code: 401, data:null, ok:false  });
    }
}
exports.isAdmin = (req,res,next)=>{

    if(req.session.username === 'admin'){
        next();
    }else{
        res.json({ message: '权限禁止', code: 401, data:null, ok:false  });
    }
}


