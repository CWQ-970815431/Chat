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
  Forum:{type:Array}
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
  state: { type: Number,default:'1' }, //接受状态（0已读，1未读）
  deleteString:{ type: String,default:'false'} //删除聊天字段（'false'未被用户删除）
});

var ForumSchema = new Schema({
  uname:{type:String},
  uimgurl:{type:String},
  userID: { type: Schema.Types.ObjectId, ref: "User" }, //用户ID
  message: { type: String }, //内容
  title:{type:String},//标题
  Forumimage: { type: String }, //图片
  time: { type: Date } ,//生成时间
  comment:{type:Array,default:[]} , //评论
  ForumID: { type: Schema.Types.ObjectId, ref: "Forum" }
});

var ForumStart = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: "User" }, //用户ID
  ForumID: { type: Schema.Types.ObjectId, ref: "Forum" },
  state: { type: String }, //（0为未收藏,1为已经收藏）
  uname:{type:String},
  uimgurl:{type:String},
  message: { type: String }, //内容
  title:{type:String},//标题
  Forumimage: { type: String }, //图片
  time: { type: Date } ,//生成时间
})

module.exports = db.model("User", UserSchema);
module.exports = db.model("Friend", FriendSchema);
module.exports = db.model("Message", Messagechema);
module.exports = db.model("Forum", ForumSchema);
module.exports = db.model("ForumStart", ForumStart);
