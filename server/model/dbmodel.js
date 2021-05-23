var mongoose = require("mongoose");
var db = require("../config/db");
var Schema = mongoose.Schema;
 
var UserSchema = new Schema({
  name: { type: String }, //用户名
  pwd: { type: String }, //密码
  email: { type: String }, //邮箱
  sex: { type: String, default: "asexual" }, //性别
  birth: { type: Date },
  phone: { type: Number },
  explain: { type: String },
  imgurl: { type: String, default: "http://localhost:3000/data/user/user.png" }, //头像
  time: { type: Date }, //注册时间
  petImg:{type:String,default:'http://localhost:3000/data/pet-user/pet.png'},
  petName:{type:String,default:'alone'},
  petSex:{type:String,default: "asexual"},
  petBirth:{type:Date},
  varieties:{type:String},//宠物品种
});

//好友表
var FriendSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: "User" }, //用户名ID
  friendID: { type: Schema.Types.ObjectId, ref: "User" }, //好友ID
  state: { type: String }, //通过状态   （0已为好友,1申请中,2申请发送方,对方还未同意）
  time: { type: Date }, //生成时间
  markname: { type: String }, //昵称
  lastTime: { type: Date }
});

//一对一消息表
var Messagechema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: "User" }, //用户ID
  friendID: { type: Schema.Types.ObjectId, ref: "User" }, //好友ID
  message: { type: String }, //内容
  types: { type: String }, //内容类型（0文字，1图片连接，2音频连接）
  time: { type: Date }, //生成时间
  state: { type: Number,default:'1' } //接受状态（0已读，1未读）
});

//群表
var GroupSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: "User" }, //用户ID
  name: { type: String }, //群名称
  imgurl: { type: String, default: "group.png" }, //群头像
  time: { type: Date }, //创建时间
  notice: { type: String } //公告
});

//群成员表
var GroupUserSchema = new Schema({
  groupID: { type: Schema.Types.ObjectId, ref: "Group" }, //群id
  userID: { type: Schema.Types.ObjectId, ref: "User" }, //用户ID
  name: { type: String }, //群内名称
  tip: { type: Number, default: 0 }, //未读消息数
  time: { type: Date }, //加入时间
  lastTime: { type: Date },
  shield: { type: Number } //是否屏蔽群消息（0不屏蔽，1屏蔽）
});

//群消息表
var GroupMsgSchema = new Schema({
  groupID: { type: Schema.Types.ObjectId, ref: "Group" }, //群id
  userID: { type: Schema.Types.ObjectId, ref: "User" }, //用户ID
  message: { type: String }, //内容
  types: { type: String }, //内容类型（0文字，1图片连接，2音频连接）
  time: { type: Date } //生成时间
});

var ForumSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: "User" }, //用户ID
  message: { type: String }, //内容
  types: { type: String }, //内容类型（0文字，1图片连接，2音频连接）
  time: { type: Date } ,//生成时间
  comment:{type:Array}
});

module.exports = db.model("User", UserSchema);
module.exports = db.model("Friend", FriendSchema);
module.exports = db.model("Message", Messagechema);
module.exports = db.model("Group", GroupSchema);
module.exports = db.model("GroupUser", GroupUserSchema);
module.exports = db.model("GroupMsg", GroupMsgSchema);
module.exports = db.model("Forum", ForumSchema);
