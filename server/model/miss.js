// //群表
// var GroupSchema = new Schema({
//     userID: { type: Schema.Types.ObjectId, ref: "User" }, //用户ID
//     name: { type: String }, //群名称
//     imgurl: { type: String, default: "group.png" }, //群头像
//     time: { type: Date }, //创建时间
//     notice: { type: String } //公告
//   });
  
//   //群成员表
//   var GroupUserSchema = new Schema({
//     groupID: { type: Schema.Types.ObjectId, ref: "Group" }, //群id
//     userID: { type: Schema.Types.ObjectId, ref: "User" }, //用户ID
//     name: { type: String }, //群内名称
//     tip: { type: Number, default: 0 }, //未读消息数
//     time: { type: Date }, //加入时间
//     lastTime: { type: Date },
//     shield: { type: Number } //是否屏蔽群消息（0不屏蔽，1屏蔽）
//   });
  
//   //群消息表
//   var GroupMsgSchema = new Schema({
//     groupID: { type: Schema.Types.ObjectId, ref: "Group" }, //群id
//     userID: { type: Schema.Types.ObjectId, ref: "User" }, //用户ID
//     message: { type: String }, //内容
//     types: { type: String }, //内容类型（0文字，1图片连接，2音频连接）
//     time: { type: Date } //生成时间
//   });

// //搜索群
// exports.searchGroup = function (data, res) {
//     let wherestr;
//     if ((data = "yike")) {
//       wherestr = {}; //查找所有群
//     } else {
//       wherestr = {
//         name: {
//           $regex: data
//         }
//       }; //输入是群名    模糊搜索
//     }
//     let out = {
//       name: 1,
//       imgurl: 1
//     };
//     Group.find(wherestr, out, function (err, result) {
//       if (err) {
//         res.send({
//           status: 500
//         });
//       } else {
//         res.send({
//           status: 200,
//           result
//         });
//       }
//     });
//   };
  
//   //判断是否在群内
//   exports.isInGroup = function (uid, gid, res) {
//     let wherestr = {
//       userID: uid,
//       groupID: gid
//     };
//     GroupUser.findOne(wherestr, function (err, result) {
//       if (err) {
//         res.send({
//           status: 500
//         });
//       } else {
//         if (result) {
//           //在群内
//           res.send({
//             status: 200
//           });
//         } else {
//           //不在群内
//           res.send({
//             status: 400
//           });
//         }
//       }
//     });
//   };

//   //按照要求获取群列表
// exports.getGroup = function (data, res) {
//     let query = GroupUser.find({});
//     //查询条件
//     query.where({
//       userID: data.uid //id为用户所在的群
//     });
//     //查找friendID 关联的user对象
//     query.populate("groupID");
//     //排序方式 最后通讯时间倒序排列
//     query.sort({
//       lastTime: -1
//     });
//     //查询结果
//     query
//       .exec()
//       .then(function (e) {
//         let result = e.map(function (ver) {
//           return {
//             id: ver.groupID._id, //获取群id
//             name: ver.groupID.name, //获取群名称
//             markname: ver.name,
//             imgurl: ver.groupID.imgurl, //获取群头像
//             lastTime: ver.lastTime, //获取最后通讯时间
//             tip: ver.tip, //群的未读消息数
//             type: 1 //判断是群还是私聊
//           };
//         });
//         res.send({
//           status: 200,
//           result
//         });
//       })
//       .catch(function (err) {
//         res.send({
//           status: 500
//         });
//       });
//   };
  
//   //按要求获取群消息
//   exports.getOneGroupMsg = function (data, res) {
//     let query = GroupMsg.findOne({});
//     //查询条件
//     query.where({
//       groupID: data.gid
//     });
//     query.populate("userID"); //关联用户表
//     //排序方式 最后通讯时间倒序排列
//     query.sort({
//       time: -1
//     });
//     //查询结果
//     query
//       .exec()
//       .then(function (e) {
//         let result = {
//           message: e.message, //消息内容
//           time: e.time, //发送时间
//           types: e.types, //发送类型
//           name: e.userID.name //谁发送的
//         };
//         res.send({
//           status: 200,
//           result
//         });
//       })
//       .catch(function (err) {
//         res.send({
//           status: 500
//         });
//       });
//   };


//   //群消息未读数修改
// exports.updateGroupMsg = function (data, res) {
//     //汇总条件
//     let wherestr = {
//       userID: data.uid,
//       groupID: data.gid
//     };
//     let updatestr = {
//       tip: 0
//     };
//     Message.updateOne(wherestr, (err, result) => {
//       if (err) {
//         res.send({
//           status: 500
//         });
//       } else {
//         res.send({
//           status: 200
//         });
//       }
//     });
//   };