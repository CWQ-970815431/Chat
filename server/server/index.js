//主页
var dbserver = require("../dao/dbserver");

//获取好友列表
exports.getFriend = function(req, res) {
  let data = req.body;

  dbserver.getUsers(data, res);
};

//获取最后一条消息
exports.getLastMsg = function(req, res) {
  let data = req.body;
  dbserver.getOneMsg(data, res);
};

//获取好友未读消息数
exports.unreadMsg = function(req, res) {
  let data = req.body;
  // console.log(data)
  dbserver.unreadMsg(data, res);
};

//好友消息数标为已读
exports.updataMsg = function(req, res) {
  let data = req.body;
  dbserver.updataMsg(data, res);
};

//获取群列表
exports.getGroup = function(req, res) {
  let data = req.body;
  dbserver.getGroup(data, res);
};

//获取群最后一条消息
exports.getLastGroupMsg = function(req, res) {
  let data = req.body;
  dbserver.getOneGroupMsg(data, res);
};

//群消息数标为已读
exports.updateGroupMsg = function(req, res) {
  let data = req.body;
  dbserver.updateGroupMsg(data, res);
};
