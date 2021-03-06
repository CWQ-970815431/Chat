//新建目录
const fs = require("fs");
const path = require("path");
exports.mkdirs = function(pathname, callback) {
  //判断是否是绝对路径
  pathname = path.isAbsolute(pathname)
    ? pathname
    : path.join(__dirname, pathname);
  //获取相对路径
  pathname = path.relative(__dirname, pathname);
  let floders = pathname.split(path.sep); //path.sep 避免平台差异带来的bug
  let pre = "";
  floders.forEach(floder => {
    try {
      //没有异常，文件已经创建，提示用户该文件已经创建
      let _stat = fs.statSync(path.join(__dirname, pre, floder));
      let hashMkdir = _stat && _stat.isDirectory();
      if (hashMkdir) {
        callback;
      }
    } catch (error) {
      //抛出异常，文件不存在则创建文件
      try {
        //避免父文件还没有创建的时候创建子文件所出现的意外bug,这里选择同步创建文件
        fs.mkdirSync(path.join(__dirname, pre, floder));
        callback && callback(null);
      } catch (error) {
        callback && callback(error);
      }
    }
    pre = path.join(pre, floder); //路径拼合
  });
};
