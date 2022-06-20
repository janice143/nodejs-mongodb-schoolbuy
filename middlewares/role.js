// 处理超级管理员和普通管理员的 认证


exports.isUser = (req,res,next)=>{
    // if(req.isAuthenticated()){
    //     next();
    // }else{
    //     req.flash('danger','Please log in')
    //     res.redirect('/users/login')
    // }
}
exports.isAdmin = (req,res,next)=>{
    console.log(req.session.admin)
    // if(req.isAuthenticated() && res.locals.user.admin===1){
    //     next();
    // }else{
    //     req.flash('danger','Please log in')
    //     res.redirect('/users/login')
    // }
}


