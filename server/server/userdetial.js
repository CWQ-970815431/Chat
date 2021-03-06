//用户详情
const db = require('../config/db');
var dbserver = require('../dao/dbserver')

//详情
exports.userDetial = function(req,res){
    let id = req.body.id;
    dbserver.userDetial(id,res)
}

//用户信息修改
exports.userUpdate = function(req,res){
    let data = req.body;
    dbserver.userUpdate(data,res);
}
//获取好友昵称
exports.getMarkName =function(req,res){
    let data = req.body
    dbserver.getMarkName(data,res);
}

//修改好友昵称
exports.updateMarkName = function(req,res){
    let data = req.body;
    dbserver.updateMarkName(data,res);
}
exports.updatePet = function(req,res){
    let data =req.body;
    dbserver.updatepet(data,res);
}
