//好友
var dbserver = require("../dao/dbserver");

//获取一对一聊天
exports.msg = function(req, res) {
  let data = req.body;
  dbserver.msg(data, res);
};

//发送的信息
exports.send = function(req, res) {
    let data = req.body;
    dbserver.sendMsg(data, res);
  };