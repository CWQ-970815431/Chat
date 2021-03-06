//引用发送邮件插件
var nodemailer = require("nodemailer");
//引入证书文件
var credentials = require("../config/credentials");

//创建传输方式
var transporter = nodemailer.createTransport({
  service: "qq",
  auth: {
    user: credentials.qq.user,
    pass: credentials.qq.pass
  }
});

//注册发送邮件给用户
exports.emailSignup = function(email, res) {
  //发送信息
  let options = {
    from: "970815431@qq.com",
    to: email,
    subject: "请忽略这条邮箱",
    html: "<span>个人网站测试功能，如若打扰属实无意，望见谅！</span>"
  };
  //发送邮件
  transporter.sendMail(options, function(err, msg) {
    if (err) {
      res.send(err);
      console.log(err);
    } else {
      res.send("邮箱发送成功！");
      console.log("邮箱发送成功！");
    }
  });
};
