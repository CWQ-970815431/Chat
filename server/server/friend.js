//好友
var dbserver = require("../dao/dbserver");

//好友申请
exports.applyFriend = function(req, res) {
  let data = req.body;
  dbserver.applyFriend(data, res);
};

//好友状态更新
exports.updateFriendState = function(req, res) {
  let data = req.body;
  dbserver.updateFriendState(data, res);
};

//拒绝好友或删除好友
exports.deleteFriend = function(req, res) {
  let data = req.body;
  dbserver.deleteFriend(data, res);
};
