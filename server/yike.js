//引入解析req.body插件
var bodyParser = require("body-parser");

const express = require("express");
const app = express();
const port = 3000;

//socket.io
var server = app.listen(8082);
var io = require("socket.io").listen(server);
require("./dao/socket")(io);


var jwt = require("./dao/jwt"); //引入token

app.get("/", (req, res) => res.send("hello world！"));
//设置允许跨域访问该服务。
app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", "3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  if (req.method == "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

//解析前端数据
//数据限制在50mb以内
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
//token判断
app.use(function(req, res, next) {
  if (typeof req.body.token != "undefined") {
    //处理token匹配
    let token = req.body.token;
    let tokenMatch = jwt.verifyToken(token);
    // console.log("token验证结果值为:"+tokenMatch);
    if (tokenMatch == 1) {
      //通过token验证
      next();
    } else {
      //验证不通过
      res.send({ status: 300 });
    }
  } else {
    next();
  }
});

//引用路由
require("./router/index")(app);
require("./router/files")(app);
//获取静态路径
// app.use(express.static('./data'));
app.use("/data/", express.static("./data/"));
//404页面
app.use(function(req, res, next) {
  let err = new Error("Not Found 404");
  err.status = 404;
  next(err);
});

//出现错误处理
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
