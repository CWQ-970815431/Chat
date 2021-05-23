//好友
var dbserver = require("../dao/dbserver");

//获取一对一聊天
exports.msg = function(req, res) {
  let data = req.body;
  dbserver.msg(data, res);
};
exports.updateLastMsgTime = function (req,res) {
  let data = req.body;
  dbserver.updateLastMsgTime(data,res)
}
//发送的信息
exports.send = function(req, res) {
    let data = req.body;
    dbserver.sendMsg(data, res);
  };
exports.deletMsg = function(req, res) {
    let data = req.body;
    dbserver.deletMsg(data, res);
  };