const { user } = require("../config/db");

module.exports = function(io){
    var users ={};
    io.on('connection',(socket)=>{
        //用户成功登录
        console.log('有用户登录');
        socket.on('login',(id)=>{
            // console.log(socket.id+'登录');
            socket.name =id
            users[id]=socket.id; 
        })
  
        //用户私发消息
        socket.on('msg',(msg,fromid,toid,getimg)=>{
        //    console.log(msg);
           //发送给好友
           if(users[toid]){
            socket.to(users[toid]).emit('msg',msg,fromid,getimg);
           }
         
        }) 
        //用户断开连接asdasd
        socket.on('disconnecting',()=>{
            if(users.hasOwnProperty(socket.name)){
                delete users[socket.name]
                console.log(socket.id+'离开');
            }
        })
      }) 
}   