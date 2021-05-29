//好友
var dbserver = require("../dao/dbserver");

//新建
exports.bulidnews = function(req, res) {
  let data = req.body;
  dbserver.buildNew(data, res);
};

//查询
exports.getForum = function(req, res) {
  let data = req.body;
  dbserver.getForum(data, res);
};
//删除
exports.deletForum = function(req, res) {
  let data = req.body;
  dbserver.deletForum(data, res);
};

//收藏
exports.collectForum = function(req, res) {
  let data = req.body;
  dbserver.collectForum(data, res);
};

//是否收藏
exports.isStar = function(req, res) {
  let data = req.body;
  dbserver.isStar(data, res);
};

//收藏列表
exports.starList = function(req, res) {
  let data = req.body;
  dbserver.getstarForum(data, res);
};

