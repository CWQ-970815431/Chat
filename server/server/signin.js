//用户登录
var dbserver = require('../dao/dbserver')
//登录
exports.signIn = function(req,res){
    let data = req.body.data;
    let pwd = req.body.pwd;

    dbserver.userMatch(data,pwd,res);

}


