//引入加密文件
var bcrypt = require("../dao/bcrypt");

//引入token
var dbmodel = require("../model/dbmodel");
var User = dbmodel.model("User");
var Friend = dbmodel.model("Friend");
var Group = dbmodel.model("Group");
var GroupUser = dbmodel.model("GroupUser");
var Message = dbmodel.model("Message");
var GroupMsg = dbmodel.model("GroupMsg");
var Forum =dbmodel.model("Forum")
var jwt = require("./jwt");

//新建用户
exports.buildUser = function(name, mail, pwd, res) {
  //密码加密
  let password = bcrypt.encryption(pwd);

  let data = {
    name: name, //用户名
    pwd: password, //密码
    email: mail, //邮箱
    time: new Date() //注册时间
  };

  let user = new User(data);

  user.save(function(err, result) {
    //用户保存
    if (err) {
      res.send({
        status: 500
      });
    } else {
      console.log(`注册成功,用户：${name}`);
      res.send({
        status: 200
      });
    }
  });
};

//匹配用户表元素个数
exports.countUserValue = function(data, type, res) {
  let wherestr = {};
  //wherestr = ['type':data];
  wherestr[type] = data;
  User.countDocuments(wherestr, function(err, result) {
    if (err) {
      res.send({
        status: 500
      });
    } else {
      res.send({
        status: 200,
        result
      });
    }
  });
};

//用户验证
exports.userMatch = function(data, pwd, res) {
  let wherestr = {
    $or: [
      {
        name: data
      },
      {
        email: data
      }
    ]
  }; //输入是用户名还是邮箱
  let out = {
    //输出项，1表示输出 0表示不输出
    name: 1,
    imgurl: 1,
    pwd: 1,
    varieties:1,
  }; 
  User.find(wherestr, out, function(err, result) {
    if (err) {
      res.send({
        status: 500
      });
    } else {
      if (result == "") {
        //数据库返回结果为空
        res.send({
          status: 400
        });
      }
      result.map(function(e) {
        const pwdMatch = bcrypt.verification(pwd, e.pwd); //密码配对
        if (pwdMatch) {
          console.log(e);
          let token = jwt.generateToken(e._id); //生成token
          let back = {
            //输出项
            id: e._id,
            name: e.name,
            imgurl: e.imgurl,
            token: token,
            pwd: e.pwd,
            varieties:e.varieties,
            
          };

          res.send({
            status: 200,
            back
          });
        } else {
          res.send({
            status: 400
          });
        }
      });
    }
  });
  
};
//搜索宠物

//搜索用户
exports.searchUser = function(data, res) {
  let wherestr;
  if (data == "all") {
    wherestr = {}; //查找所有用户
  } else {
    wherestr = {
      $or: [
        {
          name: {
            $regex: data //模糊查找
          }
        },
        {
          email: {
            $regex: data
          }
        }
      ]
    }; //输入是用户名还是邮箱    模糊搜索
  }
  let out = {
    name: 1,
    email: 1,
    imgurl: 1
  };
  User.find(wherestr, out, function(err, result) {
    if (err) {
      res.send({
        status: 500
      });
    } else {
      res.send({
        status: 200,
        result
      });
    }
  });
};
//用户匹配是否为好友
exports.isFriend = function(uid, fid, res) {
  let wherestr = {
    userID: uid,
    friendID: fid,
    state: 0
  };
  Friend.findOne(wherestr, function(err, result) {
    if (err) {
      res.send({
        status: 500
      });
    } else {
      if (result) {
        //是好友
        res.send({
          status: 200
        });
      } else {
        //不是好友
        res.send({
          status: 400
        });
      }
    }
  });
};

//搜索群
exports.searchGroup = function(data, res) {
  let wherestr;
  if ((data = "yike")) {
    wherestr = {}; //查找所有群
  } else {
    wherestr = {
      name: {
        $regex: data
      }
    }; //输入是群名    模糊搜索
  }
  let out = {
    name: 1,
    imgurl: 1
  };
  Group.find(wherestr, out, function(err, result) {
    if (err) {
      res.send({
        status: 500
      });
    } else {
      res.send({
        status: 200,
        result
      });
    }
  });
};

//判断是否在群内
exports.isInGroup = function(uid, gid, res) {
  let wherestr = {
    userID: uid,
    groupID: gid
  };
  GroupUser.findOne(wherestr, function(err, result) {
    if (err) {
      res.send({
        status: 500
      });
    } else {
      if (result) {
        //在群内
        res.send({
          status: 200
        });
      } else {
        //不在群内
        res.send({
          status: 400
        });
      }
    }
  });
};
//用户详情
//用户详情
exports.userDetial = function(id, res) {
  let wherestr = {
    _id: id
  };
  let out = {
    pwd: 0
  };
  User.find(wherestr, out, function(err, result) {
    if (err) {
      res.send({
        status: 500
      });
    } else {
      res.send({
        status: 200,
        result
      });
    }
  });
};

//用户信息修改
function update(data, update, res) {
  User.findByIdAndUpdate(data, update, function(err, resu) {
    if (err) {
      //修改失败
      res.send({
        status: 500
      });
    } else {
      //修改成功
      res.send({
        status: 200
      });
    }
  });
}

exports.userUpdate = function(data, res) {
  let updatestr = {};
  //判断是否有密码项
  if (typeof data.pwd != "undefined") {
    //有密码进行匹配
    User.find(
      {
        _id: data.id
      },
      {
        pwd: 1
      },
      function(err, result) {
        if (err) {
          res.send({
            status: 500
          });
        } else {
          result.map(function(e) {
            const pwdMatch = bcrypt.verification(data.pwd, e.pwd); //密码配对
            if (pwdMatch) {
              //密码验证成功
              //如果是修改密码先加密
              if (data.type == "pwd") {
                //密码加密
                let password = bcrypt.encryption(data.data);
                updatestr[data.type] = password;
                update(data.id, updatestr, res);
              }
               else {
                //邮箱匹配
                updatestr[data.type] = data.data;
                User.countDocuments(updatestr, function(err, result) {
                  //mongoose的方法
                  if (err) {
                    res.send({
                      status: 500
                    });
                  } else {
                    //没有匹配项，可以修改
                    if (result == 0) {
                      update(data.id, updatestr, res);
                    } else {
                      //已存在
                      res.send({
                        state: 600
                      });
                    }
                  }
                });
              }
            } else {
              //密码匹配失败
              res.send({
                status: 400
              });
            }
          });
        }
      }
    );
  } else if (data.type == "name") {
    //如果是用户名先进行匹配
    updatestr[data.type] = data.data;
    User.countDocuments(updatestr, function(err, result) {
      if (err) {
        res.send({
          status: 500
        });
      } else {
        //没有匹配项，可以修改
        if (result == 0) {
          update(data.id, updatestr, res);
        } else {
          //已存在
          res.send({
            state: 300
          });
        }
      }
    });
  } else {
    //没有密码进行匹配
    //一般项修改
    updatestr[data.type] = data.data;
    update(data.id, updatestr, res);
  }
};

//获取好友昵称
exports.getMarkName = function(data, res) {
  let wherestr = {
    userID: data.uid,
    friendID: data.fid
  };
  let out = {
    markname: 1
  };
  Friend.findOne(wherestr, out, function(err, result) {
    if (err) {
      //获取失败
      res.send({
        status: 500
      });
    } else {
      //获取成功
      res.send({
        status: 200,
        result
      });
    }
  });
};


        
//好友昵称修改
exports.updateMarkName = function(data, res) {
  let wherestr = {
    userID: data.uid,
    friendID: data.fid
  };
  let updatestr = {
    markname: data.name
  };
  Friend.updateOne(wherestr, updatestr, function(err, result) {
    if (err) {
      //修改失败
      res.send({
        status: 500
      });
    } else {
      //修改成功
      res.send({
        status: 200
      });
    }
  });
};

//好友操作
//添加好友表
exports.buildFriend = function(uid, fid, state, res) {
  let data = {
    userID: uid,
    friendID: fid,
    state: state,
    time: new Date(),
    lastTime: new Date()
  };
  // console.log(data)
  let friend = new Friend(data);

  friend.save(function(err, result) {
    if (err) {
      console.log("申请好友表出错");
    } else {
      console.log("申请好友表成功");
    }
  });
};


//添加一对一消息
exports.insertMsg = function(uid, fid, msg, type, res) {
  let data = {
    userID: uid,
    friendID: fid,
    message: msg, //发送内容
    types: type, //发送类型（0文字,1图片链接,2音频连接 。。。）
    time: new Date(), //发送时间
    state: 1 //消息状态   （0已读 1未读）
  };
  // console.log(data)
  let message = new Message(data);

  message.save(function(err, result) {
    if (err) {
      res.send({
        status: 500
      });
    } else {
      res.send({
        status: 200
      });
    }
  });
};

//好友申请
exports.applyFriend = function(data, res) {
  //判断是否已经申请过
  let wherestr = {
    userID: data.uid,
    friendID: data.fid
  };
  Friend.countDocuments(wherestr, (err, result) => {
    if (err) {
      res.send({
        status: 500
      });
    } else {
      //如果result = 0 为初次申请
      if (result == 0) {
        this.buildFriend(data.uid, data.fid, 2);
        this.buildFriend(data.fid, data.uid, 1);
      } else {
        //已经申请过好友
        this.upFriendLastTime(data);
      }
      //添加消息
      this.insertMsg(data.uid, data.fid, data.msg, 0, res);
    }
  });
};

//更新好友状态(同意好友)
exports.updateFriendState = function(data, res) {
  //修改项
  let wherestr = {
    $or: [
      {
        userID: data.uid,
        friendID: data.fid
      },
      {
        userID: data.fid,
        friendID: data.uid
      }
    ]
  };
  Friend.updateMany(
    wherestr,
    {
      state: 0
    },
    function(err, result) {
      if (err) {
        res.send({
          status: 500
        });
      } else {
        res.send({
          status: 200
        });
      }
    }
  );
};

//拒绝好友或删除好友
exports.deleteFriend = function(data, res) {
  //修改项
  let wherestr = {
    $or: [
      {
        userID: data.uid,
        friendID: data.fid
      },
      {
        userID: data.fid,
        friendID: data.uid
      }
    ]
  };
  //删除好友表的记录
  Friend.deleteMany(
    wherestr,
    {
      state: 0
    },
    function(err, result) {
      if (err) {
        res.send({
          status: 500
        });
      } else {
        res.send({
          status: 200
        });
      }
    }
  );
};

//按要求获取用户列表
exports.getUsers = function(data, res) {
  let query = Friend.find({});
  //查询条件
  query.where({
    userID: data.uid,
    state: data.state
  });

  //查找friendID 关联的user对象
  query.populate("friendID");
  //排序方式 最后通讯时间倒序排列
  query.sort({
    lastTime: -1
  });
 
  //查询结果
  query
    .exec()
    .then(function(e) {
      let result = e.map(function(ver) {
        return {
          id: ver.friendID._id, //获取好友id
          name: ver.friendID.name, //获取好友名字
          markname: ver.markname, //获取好友昵称
          imgurl: ver.friendID.imgurl, //获取好友头像
          lastTime: ver.lastTime, //获取最后通讯时间
          type:0, //判断是群还是私聊
          state:ver.friendID.state
        };
      });
       console.log(result);
      res.send({
        status: 200,
        result
      });
    })
    .catch(function(err) {
      res.send({
        status: 500
      });
    });
};

//按要求获取一对一消息
exports.getOneMsg = function(data, res) {
  let query = Message.findOne({});
  //查询条件
  query.where({
    $or: [
      {
        userID: data.uid,
        friendID: data.fid
      },
      {
        userID: data.fid,
        friendID: data.uid
      }
    ]
  });
  //排序方式 最后通讯时间倒序排列
  query.sort({
    time: -1
  });
  // console.log(query)
  // 查询结果
  query
    .exec()
    .then(function(e) {
      if(e){
        let result = {
          message: e.message, //消息内容
          time: e.time, //发送时间
          types: e.types //发送类型
        };
        res.send({
          status: 200,
          result
        });
      }
      else{
        let result ={}
        res.send({
          status:404,
          result
        })
      }
    })
    .catch(function(err) { 
      res.send({ 
        status: 500,
        err
      });
    });
};

//汇总一对一消息未读数
exports.unreadMsg = function(data, res) {
  // console.log(data);
  //汇总条件
  let wherestr = {
    $or: [
      {
        userID: data.fid,
        friendID: data.uid,
        state: 1
      },
      
    ]
  };
  // console.log(wherestr);
  Message.countDocuments(wherestr, (err, result) => {
    if (err) {
      res.send({
        status: 500
      });
    } else {
      res.send({
        status: 200,
        result
      });
    }
  });
};

//一对一消息未读数修改
exports.updataMsg = function(data, res) {
  //汇总条件
  let wherestr = {
    userID: data.fid,
    friendID: data.uid,
    state: 1
  };
  let updatestr = {
    state: 0,
    userID: data.fid,
    friendID: data.uid,
  };
  Message.updateMany(wherestr,updatestr,(err, result) => {
    if (err) {
      res.send({
        status: 500
      });
    } else {
      res.send({
        status: 200,
        updatestr,
        result
      });
    }
  });
};

//按照要求获取群列表
exports.getGroup = function(data, res) {
  let query = GroupUser.find({});
  //查询条件
  query.where({
    userID: data.uid //id为用户所在的群
  });
  //查找friendID 关联的user对象
  query.populate("groupID");
  //排序方式 最后通讯时间倒序排列
  query.sort({
    lastTime: -1
  });
  //查询结果
  query
    .exec()
    .then(function(e) {
      let result = e.map(function(ver) {
        return {
          id: ver.groupID._id, //获取群id
          name: ver.groupID.name, //获取群名称
          markname: ver.name,
          imgurl: ver.groupID.imgurl, //获取群头像
          lastTime: ver.lastTime, //获取最后通讯时间
          tip: ver.tip, //群的未读消息数
          type:1 //判断是群还是私聊
        };
      });
      res.send({
        status: 200,
        result
      });
    })
    .catch(function(err) {
      res.send({
        status: 500
      });
    });
};

//按要求获取群消息
exports.getOneGroupMsg = function(data, res) {
  let query = GroupMsg.findOne({});
  //查询条件
  query.where({
    groupID: data.gid
  });
  query.populate("userID"); //关联用户表
  //排序方式 最后通讯时间倒序排列
  query.sort({
    time: -1
  });
  //查询结果
  query
    .exec()
    .then(function(e) {
      let result = {
        message: e.message, //消息内容
        time: e.time, //发送时间
        types: e.types, //发送类型
        name: e.userID.name //谁发送的
      };
      res.send({
        status: 200,
        result
      });
    })
    .catch(function(err) {
      res.send({
        status: 500
      });
    });
};

//群消息未读数修改
exports.updateGroupMsg = function(data, res) {
  //汇总条件
  let wherestr = {
    userID: data.uid,
    groupID: data.gid
  };
  let updatestr = {
    tip: 0
  };
  Message.updateOne(wherestr, (err, result) => {
    if (err) {
      res.send({
        status: 500
      });
    } else {
      res.send({
        status: 200
      });
    }
  });
};

//消息操作
//分页获取数据一对一聊天数据
exports.msg = function(data,res){
  // var skipNum = data.nowPage*data.pageSize;
  //跳过的条数
  let query = Message.find({});
  //查询条件
  query.where({
    $or: [
      {
        userID: data.uid,
        friendID: data.fid
      },
      {
        userID: data.fid,
        friendID: data.uid
      }
    ]
  });
  query.sort({'time':-1})
  //查找friendID 关联的user对象
  query.populate("userID");
  //跳过条数
  // query.skip(skipNum)
  //限制条数
  // query.limit(data.pageSize)
  //查询结果
  query
    .exec()
    .then(function(e) {
      let result = e.map(function(ver) {
        return { 
          id: ver._id, //获取id
          message:ver.message,
          type:ver.types,
          time:ver.time,
          fromId:ver.userID._id,
          imgurl: ver.userID.imgurl, //获取头像    
          state:ver.state
        };
      });
      res.send({
        status: 200,
        result
      });
    })
    .catch(function(err) {
      res.send({
        status: 500
      });
    });
}
//sendMsg
exports.sendMsg =function (data,res){
  let wherestr = {
    userID: data.uid,
    friendID: data.fid
  };
  let msgdata = {
    userID: data.uid, //用户ID
    friendID: data.fid, //好友ID
    message: data.message, //内容
    types: data.types, //内容类型（0文字，1图片连接，2音频连接）
    time: data.time, //生成时间
    state: 1 //接受状态（0已读，1未读）
  };
    
     let message = new Message(msgdata);

      message .save(function(err, result) {
    //消息保存
    if (err) {
      res.send({
        status: 500
      });
    } else {
      // console.log(`存储消息成功：${result}`);
      res.send({
        status: 200
      });
    }
  });
    
 
}

exports.updateLastMsgTime = function(data, res) {
  //汇总条件
  let wherestr = {
    $or: [
      {
        userID: data.uid,
        friendID: data.fid,
        state:0,
      },
      {
        userID: data.fid,
        friendID: data.uid,
        state:0,
      }
    ]
  };
  Friend.updateMany(
    wherestr,
    {
      lastTime:new Date()
    },
    function(err, result) {
      if (err) {
        res.send({
          status: 500
        });
      } else {
        res.send({
          status: 200
        });
      }
    }
  );
};

//删除聊天记录
exports.deletMsg = function(data, res) {
  //修改项
  let wherestr = {
    $or: [
      {
        userID: data.uid,
        friendID: data.fid
      },
      {
        userID: data.fid,
        friendID: data.uid
      }
    ]
  };
  //删除好友表的记录
  Message.deleteMany(
    wherestr,
    function(err, result) {
      if (err) {
        res.send({
          status: 500
        });
      } else {
        res.send({
          status: 200
        });
      }
    }
  );
};


exports.buildNew = function(data,res){
  let New = {
    userID: data.uid, //用户名
    message: data.message, //邮箱
    time: new Date(), //注册时间
    comment:data.comment
  };

  let News = new Forum(New);

  News.save(function(err, result) {
    //用户保存
    if (err) {
      res.send({
        status: 500
      });
    } else {
      console.log(`发布成功：${result}`);
      res.send({
        status: 200
      });
    }
  });
}