<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image class="back-img" src="../../static/back.png" mode=""></image>
			</view>
			<view class="top-bar-center title">	详细	</view>
			<view class="top-bar-right pice"></view>
		</view>
		<view class="main">
			<view class="column head">
				<view class="row head">
					<view class="title">头像</view>
					<view class="user-header" v-if="id == uid">
						<image-cropper :src="tempFilePath" @confirm="confirm"  @cancel="cancel"></image-cropper>				
						<image :src="cropFilePath" @tap="upload" class="user-img"></image>
	
					</view>
					<view class="more" v-if="id == uid">
						<image src="../../static/img/common/more.png" mode="aspectFill"></image>
					</view>
					<image :src="cropFilePath" v-if="id != uid" class="user-img"></image>
					
				</view>
				<view class="row"  v-if="id == uid" @tap="modify('explain','签名',user.explain,false)">
					<view class="title" >签名</view>
					<view class="cont">
						{{user.explain}}
					</view>
					<view class="more" >
						<image src="../../static/img/common/more.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="row"  v-if="id != uid" >
					<view class="title" >签名</view>
					<view class="cont">
						{{user.explain}}
					</view>
				
				</view>
				<view class="row">
					<view class="title">注册</view> 
					<view class="cont">
						{{changeTime(user.time)}}
					</view>
					
				</view>
			</view>
			<view class="column ">
				<view class="row" v-if="id ==uid" @tap="modify('name','昵称',user.name,false)">
					<view class="title">昵称</view>
					<view class="cont">
						{{user.name}}
					</view>
					<view class="more">
						<image src="../../static/img/common/more.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="row" v-if="id !=uid" @tap="modify('markname','昵称',user.markname,false)">
					<view class="title">昵称</view>
					<view class="cont">
						{{markname}}
					</view>
					<view class="more">
						<image src="../../static/img/common/more.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="row ">
					<view class="title">性别</view>
					<view class="cont">
						<picker @change="bindPickerChange" :value="index" :range="array" v-if="id == uid">
							<view class="uni-input">{{array[index]}}</view>
						</picker>
						<view class="uni-input" v-if="id != uid">{{array[index]}}</view>
					</view>
					<view class="more" v-if="id ==uid">
						<image src="../../static/img/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="row" v-if="id == uid">
					<view class="title">生日</view>
					<view class="cont">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
						    <view class="uni-input">{{date}}</view>
						 </picker>

					</view>
					<view class="more">
						<image src="../../static/img/common/more.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="row" v-if="id != uid">
					<view class="title">生日</view>
					<view class="cont">
						    <view class="uni-input">{{date}}</view>
				
					</view>
	
				</view>
				<view class="row"  v-if="id == uid" @tap="modify('phone','电话',user.phone,false)">
					<view class="title">电话</view>
					<view class="cont">
						{{user.phone}}
					</view>
					<view class="more">
						<image src="../../static/img/common/more.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="row" v-if="id != uid">
					<view class="title">电话</view>
					<view class="cont">
						{{user.phone}}
					</view>
					
				</view>
				<view class="row" v-if="id == uid"  @tap="modify('email','邮箱',user.email,true)">
					<view class="title">邮箱</view>
					<view class="cont">
						 	{{user.email}}
					</view>
					<view class="more">
						<image src="../../static/img/common/more.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="row" v-if="id != uid">
					<view class="title">邮箱</view>
					<view class="cont">
						 	{{user.email}}
					</view>
				</view>
				<view class="row" v-if="id == uid" @tap="modify('pwd','密码','',true)">
					<view class="title">密码</view>
					<view class="cont">
						 *******
					</view>
					<view class="more">
						<image src="../../static/img/common/more.png" mode="aspectFill"></image>
					</view>
				</view>
				
			</view>
			<view class="bt2" @tap="outlogin" v-if="id == uid">退出登录</view>
			<view class="bt2" @tap="deleteFriend" v-if="id != uid">删除好友</view>
			<view class="bt2 bt3" @tap="deleteMsg" v-if="id != uid">清空聊天记录</view>
		</view>
		<view class="modify" :style="{bottom:-+widHeight+'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="modifyStbmitBack">取消</view>
				<view class="title">{{modifyTitle}}</view>
				<view class="define" @tap="modifyStbmit">确定</view>
			</view>
			<view class="modify-main">
				<input type="text" v-model="pwd" class="modify-pwd" placeholder="请输入原密码" placeholder-style="color:#aaa;font-weight:400;" :style="{display:ispwd}"></input>
				<textarea v-model="data" class="modify-content"></textarea>
				
			</view>
		</view>
	</view>
</template>
 
<script>
	import ImageCropper from "../../components/ling-imgcropper/ling-imgcropper.vue";
	import myfun from "../../common/js/myfun.js"
	export default {
		data() {
			  const currentDate = this.getDate({ 
			            format: true,
						})
			return { 
				back:false,
				user:'',
				cropFilePath:'../../static/img/one.jpg',
				array:['男','女','未知'],
				index: '' ,
				oldindex:'',
				uid:'',
				id:'',
				myname:'',
				token:'',
				markname:'',
				date: currentDate,
				time: '12:01',
				modifyTitle:'',
				type:'',
				oldData:'',				//原始数据
				tempFilePath: '',
				data:'修改内容',			//修改内容
				pwd:undefined,
				animationData:{},			//动画
				isModfiy:false,				//动画开关
				widHeight:'1000',				//页面高度
				ispwd:'none',			//是否显示密码
			};
		},
		onLoad(e) {
			this.id = e.id;
			if(e.back){
				this.back =e.back
			}
			this.getStorages();
			this.getUser();
			this.getMarkName();
		},
		  computed: {
		        startDate() {
		            return this.getDate('start');
		        },
		        endDate() {
		            return this.getDate('end');
		        }
		    },
			 components: {ImageCropper},
			 onReady:function(){
			 	this.getElementStyle();
			 },
			
		methods:{
			getStorages:function(){
				try {
					
				    const value = uni.getStorageSync('user');
					// console.log(value)
				    if (value) {
						//数据缓存存在
						this.uid =value.id;
						this.token = value.token;
						this.myname = value.name;
				    }else{
						//如果没有数据缓存，跳转到登陆页面
						uni.navigateTo({
							url:'../login/login',
						})
					}
				} catch (e) {
				    // error
				}
			},
			//获取用户信息
			getUser:function(){
				uni.request({
					url: this.serverUrl + '/user/detial',		//获取用户信息
					data: {
						id:this.id,
						token:this.token,
					},
					method: "POST",
					success: (data) => {
						console.log("后台返回的数据")
						if(data.data.result.length == 0){
							uni.navigateTo({
								url:'../login/login',
							})
						}
						else{
							let status = data.data.status;
							if (status == 200) {
								//访问后端成功
								let res = data.data.result[0];
								
								//处理头像链接
								this.cropFilePath = res.imgurl;
								//处理简介
								if(res.explain == undefined){
									res.explain = '这个人很懒,什么也没留下~';
								}
								//处理生日 
								if(res.birth == undefined){
									console.log(res)
									this.date = '0000-00-00';
									
								}
									else{
										let birth = myfun.detialTime1(res.birth)
										this.date =birth;
									}
								//处理电话
								if(res.phone == undefined){
									res.phone = '000';
								}
								//处理markname
								if(this.markname.length==0){
									this.markname = res.name;
								}
								this.sexJudge(res.sex);
								this.user = res; 
								// console.log("需要渲染的数据")
								// console.log(this.user);
							} else if (status == 500) {
								uni.showToast({
									title: '服务器出错了！',
									duration: 2000, //显示时间
									icon: 'none'
								})
							}
						}
						
					}
				})
			},
			//返回登录页面
			backOne:function(){
				
				if(!this.back){
					let pages = getCurrentPages();  // 获取当前页面栈层数     例如16
					    let backPages = pages.length - 1;  // 当前层数减一获取要跳转的页面的层数   15
					        uni.navigateBack({
					             delta: backPages         //跳转十五层  回到第一层页面
					        })
						
				}else{
					console.log(this.myname)
					uni.reLaunch({
						url:'../user/user?name='+this.user.name
					})
				}
				
				
			},
			//获取好友昵称
			getMarkName : function(){
				if(this.id != this.uid){
					uni.request({
						url: this.serverUrl + '/user/getmarkname',		//判断是否为好友
						data: {
							uid:this.uid,
							fid:this.id,
							token:this.token,
						},
						method: "POST",
						success: (data) => {
							// console.log(data)
							let status = data.data.status;
							if (status == 200) {
								let res = data.data.result;
								if(res.markname!=undefined){
									//昵称存在
									this.markname = res.markname;
								}
							} else if (status == 500) {
								uni.showToast({
									title: '服务器出错了！',
									duration: 2000, //显示时间
									icon: 'none'
								})
							}else if (status == 300) {
								//token过期
								uni.navigateTo({
									url:'../signin/signin?name='+this.myname
								})
							}
						}
					})
				}
				
			},
					//退出登录
			outlogin:function(){
				uni.showModal({
					title:'提示',
					content:'确定要退出登录吗?',
					success:(res)=>{
						if(res.confirm){	//点击确定
							//清除缓存
							uni.removeStorage({
								key:'user',
								success:function(res){
									console.log('success');
								}
							});
							//用户重新去登录
							uni.reLaunch({
								url:'../login/login',
							})
						}else if(res.cancel){
							
						}
					},
				})
				
			},
			//时间处理
			changeTime: function(date){
				return myfun.datialTime(date);
			},
			//性别判断
			sexJudge:function(e){
				if(e == 'female'){
					//女性
					this.index = 1;
				}else if(e == 'male'){
					//男性
					this.index =0;
				}else{
					//未知
					this.index =2;
				}
			},
			//性别选择器
			 bindPickerChange: function(e) {
				  this.oldindex = this.index
			      this.index = e.target.value
				  if(this.index != this.oldindex){
					  let sex = 'asexual';
					  if(this.index==0){
					  		sex = 'male';
					  }else if(this.index ==1){
					  			sex = 'female'
					  }
					  this.update(sex,'sex',undefined)
				  }
				  
			   },
			   //时间选择器
			bindDateChange: function(e) {
				let olddate = this.date;
				this.date = e.target.value;
				if(this.date != olddate){
					this.update(this.date,'birth',undefined);
				}
				
			},
			getDate(type) {
		            const date = new Date();
		            let year = date.getFullYear();
		            let month = date.getMonth() + 1;
		            let day = date.getDate();
		
		            if (type === 'start') {
		                year = year - 60;
		            } else if (type === 'end') {
		                year = year + 2;
		            }
		            month = month > 9 ? month : '0' + month;;
		            day = day > 9 ? day : '0' + day;
		            return `${year}-${month}-${day}`;
		        },
				//头像裁剪
				upload() {
				            uni.chooseImage({
				                count: 1, //默认9
				                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				                sourceType: ['album','camera'], //从相册选择
				                success: (res) => {
				                     this.tempFilePath = res.tempFilePaths.shift()
				                }
				            });
				        },
						cancel(){
							console.log('canceled')
						},
						
						//获取页面高度
						getElementStyle:function(){
							const query = uni.createSelectorQuery().in(this);
							query.select('.modify').boundingClientRect(data => {
								// console.log("得到布局位置信息"+ JSON.stringify(data));
								// console.log("节点离页面顶部得距离为"+ data.top);
								this.widHeight =data.height;
							}).exec();
						},
						
						//修改项弹框
						modify:function(t,type,data,ispwd){
							if(ispwd){
								this.ispwd = 'block';
								this.pwd = '0'
							}else{
								this.ispwd = 'none';
								this.pwd = undefined;
							}
							this.type = t;
							this.modifyTitle=type;
							this.oldData = data;
							this.data = data;
							this.modifyStbmitBack()
						},
						//弹框修改
						modifyStbmit:function(){
							
							//提交修改
							if(this.data.length>0 &&this.data != this.oldData){
								if(this.type == 'markname'){
									this.updateFriendName();
									this.markname = this.data;
									
								}else if(this.type ==='email'){
									//匹配邮箱格式
									let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
									if(reg.test(this.data)){
										this.update(this.data,this.type,this.pwd);
									}else{
										uni.showToast({
											title: '邮箱格式错误',
											duration: 2000, //显示时间
											icon: 'none'
										})
									}
								}else if(this.type === 'explain'){
									this.update(this.data,this.type,this.pwd);
								}
								else{
									if(this.type = 'name'){

										const value = uni.getStorageSync('user');
										value.name =this.data
										uni.setStorageSync('user',value);
									}
									this.update(this.data,this.type,this.pwd);
								}
								
							}
							//关闭弹出层
							this.modify();
						
						},
						modifyStbmitBack:function(){
							var animation = uni.createAnimation({
								duration:300,
								timingFunction:'ease',
							})
							this.isModfiy = !this.isModfiy;
							if(this.isModfiy){
								animation.bottom(0).step();
							}else{
								animation.bottom(-this.widHeight).step();
							}
							this.animationData =animation.export()
						},
						//图片上传
				confirm (e){
				             this.tempFilePath = "";
				             this.cropFilePath = e.detail.tempFilePath;
							
				             
				             uni.uploadFile({
				               url: this.serverUrl+'/files/upload',
				               filePath: this.cropFilePath,
				               name: "file",
				               fileType: "image",
				              formData: {
				              		url:'user',
									name:this.uid,
									token:this.token
							  },
				               success: (uploadFileRes) => {
				                 var backstr =this.serverUrl+'/'+uploadFileRes.data
								 // .replace('data/user/',"");
								 // console.log(backstr)
				                 //存储用户信息修改
								 try{
								 	uni.setStorageSync('user',{
								 		'id':this.uid,
								 		'name':this.name,
								 		'imgurl':backstr,
								 		'token':this.token
								 	});
								 }catch(e){
								 	//error
								 	console.log('数据存储出错');
								 }
								 //存储头像到数据库
								 this.update(backstr,'imgurl',undefined)
				               },
				       
				               fail(e) {
				                 console.log("this is errormes " + e.message);
				               },
				             });
				       
				            
				           },
						   //数据修改
						   update:function(e,type,pwd){
							   uni.request({
							   	url: this.serverUrl + '/user/update',		
							   	data: {
							   		id:this.uid,
							   		data:e,
									type:type,
									pwd:pwd,
							   		token:this.token,
							   	},
							   	method: "POST",
							   	success: (data) => {
									
									let status = data.data.status;
							   		console.log('状态码：'+status)
									if (status == 200) {
										this.user[type] = e;
										console.log('type:'+type)
										if(type == 'pwd'){
											//修改密码后需要重新登录
											//清除缓存
											uni.removeStorage({
												key:'user',
												success:function(res){
													console.log('success')
												}
											})
											uni.redirectTo({
												url:'../login/login?cgpwd='+this.myname
											})
										}
							   		}else if (status == 400) {
							   			uni.showToast({
							   				title: '输入原始密码错误',
							   				duration: 2000, //显示时间
							   				icon: 'none'
							   			})}
										else if (status == 201) {
											uni.showToast({
												title: '已被占用',
												duration: 2000, //显示时间
												icon: 'none'
											})}
							   		 else if (status == 500) {
							   			uni.showToast({
							   				title: '服务器出错了！',
							   				duration: 2000, //显示时间
							   				icon: 'none'
							   			})
							   		}else if (status == 300) {
							   			//token过期
							   			uni.navigateTo({
							   				url:'../login/login?name='+this.myname
							   			})
							   		}
							   	}
							   })
						   },	
						   //好友昵称修改
						   updateFriendName:function(){
						   	if(this.data.length>0 &&this.data!=this.oldData){
						   		uni.request({
						   			url: this.serverUrl + '/user/updatemarkname',		//修改好友昵称
						   			data: {
						   				uid:this.uid,
						   				fid:this.id,
						   				name:this.data,
						   				token:this.token,
						   			},
						   			method: "POST",
						   			success: (data) => {
						   				let status = data.data.status;
						   				if (status == 200) {
						   					//访问后端成功
						   					console.log('好友昵称修改成功')
											
						   					
						   				} else if (status == 500) {
						   					uni.showToast({
						   						title: '服务器出错了！',
						   						duration: 2000, //显示时间
						   						icon: 'none'
						   					})
						   				}else if (status == 300) {
						   					//token过期
						   					uni.navigateTo({
						   						url:'../signin/signin?name='+this.myname
						   					})
						   				}
						   			}
						   		}) 
						   	}
						   },
					//删除好友
					deleteFriend:function(){
						uni.showModal({
							title:'提示',
							content:'确定删除好友吗?',
							success:(res)=>{
								if(res.confirm){	//点击确定
									uni.request({
										url: this.serverUrl + '/friend/deletefriend',		//删除好友
										data: {
											uid:this.uid,
											fid:this.id,
											token:this.token,
										},
										method: "POST",
										success: (data) => {
											let status = data.data.status;
											if (status == 200) {
												//删除好友 跳回首页
												console.log('好友删除成功')
												uni.navigateBack({
													delta:1
												})
											} else if (status == 500) {
												uni.showToast({
													title: '服务器出错了！',
													duration: 2000, //显示时间
													icon: 'none'
												})
											}else if (status == 300) {
												//token过期
												uni.navigateTo({
													url:'../signin/signin?name='+this.myname
												})
											}
										}
									}) 
								}else if(res.cancel){
									
								}
							}
						})
					},
					//删除聊天记录
					deleteMsg:function(){
						uni.showModal({
							title:'提示',
							content:'确定删除聊天记录吗?',
							success:(res)=>{
								if(res.confirm){	//点击确定
									uni.request({
										url: this.serverUrl + '/chat/deletMsg',		//删除好友
										data: {
											uid:this.uid,
											fid:this.id,
											token:this.token,
										},
										method: "POST",
										success: (data) => {
											let status = data.data.status;
											if (status == 200) {
												//删除聊天 跳回首页
												console.log('聊天记录删除成功')
											} else if (status == 500) {
												uni.showToast({
													title: '服务器出错了！',
													duration: 2000, //显示时间
													icon: 'none'
												})
											}else if (status == 300) {
												//token过期
												uni.navigateTo({
													url:'../signin/signin?name='+this.myname
												})
											}
										}
									}) 
								}else if(res.cancel){
									
								}
							}
						})
					}
				    }
		    }	
		
	
	
</script>

<style lang="scss">
		@import "../../common/css/mycss.scss";
		.top-bar{
			background: rgba(255,255,255,0.96);
			border-bottom: 1px solid $uni-bg-color;
		}
		.main {
			padding-top:118rpx;
			display: flex;
			flex-direction: column;
			.column{
				display: flex;
				flex-direction: column;
				padding-top: 12rpx;
				width: 100%;
				border-bottom: 1px solid $uni-bg-color;
				.row{
					display: flex;
					flex-direction: row;
				}
				.title{
					flex: none;
					padding:0 $uni-spacing-col-base;
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 112rpx;
				}
				.head{
					height: 148rpx;
					display: flex;
					align-items: center;
				}
				.user-img{
					width: $uni-img-size-lg;
					height: $uni-img-size-lg;
					border-radius: $uni-border-radius-base;
				}
				.user-header{
					flex:auto;
				}
				.cont{
					flex: auto;
					padding-left: $uni-spacing-col-base;
					font-size: $uni-font-size-lg;
					color: $uni-text-color-grey;
					line-height: 112rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.more{
					flex:none;
					height: 112rpx;
					display: flex;
					align-items: center;
					image{
						width: 80rpx;
						height: 28rpx;
					}
		
				}
			}
			.bt2{
				margin-top: 130rpx;
				text-align: center;
				font-size: $uni-font-size-lg;
				color: $uni-color-warning;
				line-height: 88rpx;
				
			}
			.bt3{
				margin-top: 50rpx;
				color: #FF0000;
				border: 1px solid rgba(128,128,128,0.2);
			}
		}
		// 修改弹框
		.modify{
			position: fixed;
			z-index: 1002;
			left: 0;
			height: 100%;
			width: 100%;
			background-color: #fff;
			.modify-header {
				width: 100%;
				height: 88rpx;
				padding-top: var(--staus-bar-height);
				display: flex;
				flex-direction: row;
				align-items: center;
				border-bottom: 1px solid $uni-bg-color;
				.close{
					padding-left: $uni-spacing-col-base;
					font-size:$uni-font-size-lg ;
					color:$uni-text-color ;
					line-height: 44rpx;
				}
				.title{
					flex: auto;
					text-align: center;
					font-size:$uni-font-size-lg;
					color:$uni-text-color ;
					line-height:88rpx;
				}
				.define{
					padding-left: $uni-spacing-col-base;
					font-size:$uni-font-size-lg;
					color:$uni-color-success ;
					line-height:44rpx;
				}
			}
			.modify-main{
				display: flex;
				padding: $uni-spacing-col-base;
				flex-direction: column;
				.modify-pwd {
					box-sizing: border-box;
					padding: 0 20rpx;
					margin-bottom: $uni-spacing-col-base;
					flex: auto;
					height: 88rpx;
					background: $uni-bg-color-grey;
					border-radius: $uni-border-radius-base;
					font-size:$uni-font-size-lg ;
					color:$uni-text-color ;
					line-height: 88rpx;
				}
				.modify-content{
					padding: 16rpx 20rpx;
					box-sizing: border-box;
					flex: auto;
					width: 100%;
					height: 386rpx;
					background: $uni-bg-color-grey;
					border-radius: $uni-border-radius-base;
					font-size:$uni-font-size-lg ;
					color:$uni-text-color ;
					line-height: 44rpx;
				}
			}
		}
			
</style>
