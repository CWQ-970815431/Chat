<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image class="back-img" src="../../static/back.png" mode=""></image>
			</view>
			<view class="top-bar-center title">	{{fname}}	</view>
			<view class="top-bar-right pice" @tap="userDetial">
				<image src="../../static/index/mannager.png" mode=""></image>
			</view>
		</view>
		<scroll-view class="chat" scroll-y="true" scroll-with-animation="true"  :scroll-into-view="scrollToView">
			<view class="chat-main" :style="{paddingBottom:inputh+'px'}">
				<view class="show-more" @tap="showMorePage" v-if="msgsall.length > msgs.length">
					显示更多
				</view>
				<view class="chat-ls" v-for="(item,index) in msgs" :keys="index" :id="'msg'+item.tip">
					<view class="chat-time" v-if="item.time">{{changeTime(item.time)}}</view>
					<view class="msg-m msg-left" v-if="item.fromId == fid">
						<navigator :url="'../userhome/userhome?id='+fid"  hover-class="none" >
							<image :src="item.imgurl" class="user-img"  mode=""></image>
						</navigator>
						
						<view class="massage" v-if="item.type == 0">
							<view class="msg-text">{{item.message}}</view>
						</view>
						<view class="massage" v-if="item.type == 1">
							<image @tap="previewImg(item.message)" :src="item.message" class="msg-img" mode="widthFix"></image>
						</view>
					</view>
					<view class="msg-m msg-right" v-if="item.fromId  != fid">
						<navigator :url="'../userhome/userhome?id='+uid"  hover-class="none" >
							<image :src="item.imgurl" class="user-img"  mode=""></image>
						</navigator>
						<view class="massage" v-if="item.type == 0">
							<view class="msg-text">{{item.message}}</view>
						</view>
						<view class="massage" v-if="item.type == 1">
							<image @tap="previewImg(item.message)" :src="item.message" class="msg-img" mode="widthFix"></image>
						</view>
						
					</view>
				</view>
				
			</view>
		
		</scroll-view>
		<submit @inputs="inputs" @heights="heights"></submit>
	</view>
</template> 

<script>
	import datas from '../../common/js/datas.js'
	import myfun from '../../common/js/myfun.js'
	import submit from '../../components/submit/submit.vue'
	export default {
		data() {
			return {
				msgs:[],
				imgMsg:[],
				oldTime:new Date(),
				scrollToView:'',
				inputh:'60',
				uid:'',
				uimgurl:'',
				token:'',
				uname:'',
				fid:'',
				fname:'',
				type:'',
				fimgurl:'',
				msgsall:[],
				nowpage:0,
				pagesize:10,
			};
		},
		onLoad(e) {
			this.fid= e.id;
			this.fname = e.name;
			this.type =  e.type;
			this.fimgurl = e.imgurl
			this.getStorages()
			this.getMsg()
			this.updataMsg()
			this.receiveSocketMsg();
			this.goBottom()
		},
		components:{
			submit,
		},
		methods:{
			userDetial:function(){
				uni.navigateTo({
					url:'../userdetials/userdetials?id='+this.fid,
				})
			},
			//获取缓存
			getStorages:function(){
				try {
		
				    const value = uni.getStorageSync('user');
								// console.log(value)
				    if (value) {
						//数据缓存存在
				        // console.log(value);
						this.uid =value.id;
						this.uimgurl = value.imgurl;
						this.token = value.token;
						this.uname = value.name;
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
			//返回上一级
			backOne:function(){
				let pages = getCurrentPages();  // 获取当前页面栈层数     例如16
				    let backPages = pages.length - 1;  // 当前层数减一获取要跳转的页面的层数   15
				        uni.navigateBack({
				             delta: backPages         //跳转十五层  回到第一层页面
				        })
				
			},
			//处理时间
			changeTime:function(date){
				return myfun.dateTime1(date)
			},
			//更新好友未读数
			updataMsg:function(date){
				uni.request({
								url: this.serverUrl + '/index/updatemsg',		
								data: {
									uid:this.uid,
									fid:this.fid,
									token:this.token,
								},
								method: "POST",
								success: (data) => {
									let status = data.data.status;
									if (status == 200) {
									
											
									
									} else if (status == 500) {
										uni.showToast({
											title: '发送信息出错了！',
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
				let msg = datas.message()
			},
			//获取聊天数据
			getMsg:function(){
				uni.request({
								url: this.serverUrl + '/chat/msg',		
								data: {
									uid:this.uid,
									fid:this.fid,
									token:this.token,
								},
								method: "POST",
								success: (data) => {
									let status = data.data.status;
									if (status == 200) {
									let msg = data.data.result;
									let len =this.msgs.length+2;
										
										for(var i = 0; i < msg.length;i++){
											//时间间隔
											if(i<msg.length-1){
												let t = myfun.spacTime(this.oldTime,msg[i].time)
												// console.log(t)
												if(t){
													this.oldTime = t
												}
												msg[i].time = t;
											}
											msg[i].tip = i
											//图片发送时改变
											if(msg[i].type == 1){
												// msg[i].message =msg[i].message.slice(5)
												// var y = msg[i].message.slice(0,22)
												// var x = msg[i].message.slice(22)
												// msg[i].message = y +'static/img/'+ x 
												// console.log(x)
												// console.log(msg[i].message)
												// msg[i].message ="../../static/img/" + msg[i].message
												this.imgMsg.unshift(msg[i].message)
											}
											//判断发送方
											
											this.msgsall.unshift(msg[i]);
										
										}
										// console.log(this.msgsall)
										this.showPage(this.msgsall.length)
										this.$nextTick(function(){
											this.scrollToView= 'msg'+len;
										})
										// console.log(this.msgs)
									} else if (status == 500) {
										uni.showToast({
											title: '发送信息出错了！',
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
				let msg = datas.message()
			
				
		},
		//预览图片
		previewImg:function(e){
			let index = 0;
			for(let i = 0;i<this.imgMsg.length;i++){
				if(this.imgMsg[i] == e){
					index = i;
				}
			}
			uni.previewImage({
						current:index,
			            urls:this.imgMsg,
			            longPressActions: {
			                itemList: ['发送给朋友', '保存图片', '收藏'],
			                success: function(data) {
			                    console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
			                },
			                fail: function(err) {
			                    console.log(err.errMsg);
			                }
			            }
			        })
		},
		//显示信息条数
		showPage:function(len){
			if(len<11){
				this.msgs =this.msgsall
			}else{
				let show =1
				let nowALL = [...this.msgsall]
				// console.log('nowallll',nowALL)
				while(show < this.pagesize+1){
					this.msgs.unshift(nowALL[len-show]) 
					show++
				}
			}
			
			// console.log('showwwww',this.msgs)
		},
		//显示更多消息条数
		showMorePage:function(){
			let lenALL= this.msgsall.length
			let nowlen = this.msgs.length
			let lenchange = lenALL-nowlen
			if(lenchange>10){
				let show =lenchange
				let i=0 ;
				while(i<10){
					this.msgs.unshift(this.msgsall[lenchange-i])
					i++
				}
			}else{
				this.msgs = this.msgsall

			}
			console.log(this.msgs)
		},
		//接受数据
		inputs:function(e){
			var a ={
				id:this.uid,
				imgurl:this.uimgurl,
				message:e.message,
				type:e.types,		//内容类型（0文字，1图片，2音频）
				time:new Date(),	//发送时间
				tip:this.msgs.length,
			}
			//短期发送时间隐藏
				let t = myfun.spacTime(this.oldTime,a.time)
				// console.log(t)
				if(t){
					this.oldTime = t
				}
				a.time = t;
			this.msgs.splice(this.msgs.length,0,a)
			// console.log(this.msgs)
			if(e.types == 1){
				this.imgMsg.push(e.message);
				//提交图片
				
				let url = myfun.fileName(new Date())
				const uploadTask = uni.uploadFile({
				    url:this.serverUrl+'/files/upload',//仅为示例，非真实的接口地址
				    filePath: e.message,
				    name: 'file',
				    formData: {
						url:url,
						name:new Date().getTime()+this.uid+Math.ceil(Math.random()*10),
				    },
				    success: (uploadFileRes,FormData) => {
						
						let path = uploadFileRes.data;
						let data1 = {
							message:path,
							types:1,
						}
						uni.request({
									url: this.serverUrl + '/chat/send',		
									data: {
										uid:this.uid,
										fid:this.fid,
										message: this.serverUrl+'/'+path, //内容
										 types:e.types,
										 time: new Date(), //生成时间
										 state: 1 ,//接受状态（0已读，1未读）
										token:this.token,
									},
									method: "POST",
									success: (data) => {
										let status = data.data.status;
										if (status == 200) {
											this.updateLastTime()
											this.sendSocket(data1)
											  this.goBottom()
											  
										} else if (status == 500) {
											uni.showToast({
												title: '发送信息出错了！',
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
				});
				
			}
			
			//socket提交
			if(e.types == 0){
				uni.request({
							url: this.serverUrl + '/chat/send',		
							data: {
								uid:this.uid,
								fid:this.fid,
								message:e.message, //内容
								 types:e.types,
								 time: new Date(), //生成时间
								 state: 1 ,//接受状态（0已读，1未读）
								token:this.token,
							},
							method: "POST",
							success: (data) => {
								let status = data.data.status;
								if (status == 200) {
									this.updateLastTime()
									//发送给后端
									this.sendSocket(e)
									  this.goBottom()
									  
								} else if (status == 500) {
									uni.showToast({
										title: '发送信息出错了！',
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
		 //发送数据
		 sendSocket:function(e){
			 this.socket.emit('msg',e,this.uid,this.fid,this.uimgurl);
		 },
		 //socket聊天数据
		 receiveSocketMsg:function(){
				this.socket.on('msg',(msg,fromid,getimg) => {
					if(this.fid == fromid){
						console.log(msg,getimg)
							let len =this.msgs.length
							let nowtime = new Date();
							let t = myfun.spacTime(this.oldTime,nowtime)
								// console.log(t)
							if(t){
									this.oldTime = t 
								}
								nowtime = t;

							var a ={
								fromId:fromid,
								message:msg.message,
								type:msg.types,		//内容类型（0文字，1图片，2音频）
								time:nowtime,	//发送时间
								tip:this.msgs.length,
								imgurl:getimg
							}
							if(msg.types ==1){
								a.message=this.serverUrl+'/'+msg.message
								this.imgMsg.push(a.message);
							}
							//短期发送时间隐藏		
							this.msgs.push(a)
							console.log('aa',a)
							
							this.goBottom()
					
					}
					});	
			},
		 //更新最后通话时间
		 updateLastTime:function(){
			 
			 uni.request({
			 			url:this.serverUrl + '/chat/updateLast',
			 			data:{
			 				uid:this.uid,
			 				fid:this.fid,
							token:this.token,
			 			},
			 			method: "POST",
			 			success: (data) => {
			 				let status = data.data.status;
							if (status == 500) {
			 					uni.showToast({
			 						title: '发送信息出错了！',
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
	
		 },
		//输入框高度
		heights:function(e){
			this.inputh=e
			this.goBottom()
		},
		//滚动到底部
		goBottom:function(){
			this.scrollToView = '';
			this.$nextTick(function(){
				let len = this.msgs.length-1;
				if(this.msgs[len].tip){
				this.scrollToView= 'msg'+this.msgs[len].tip;	
				}
			})
		}
	},
	}
</script>

<style lang="scss">
	@import "../../common/css/mycss.scss";
	page{
		height: 100%;
	}
	.top-bar .top-bar-center{
		font-size: 25px;
	}
	.content{
		height: 100%;
		background:rgba(244,244,244,1) ;
	}
	.top-bar{
		background: rgba(244,244,244,0.96);
		border-bottom: 1px solid $uni-border-color;
	}
	.chat{
		height: 100%;
		
		.chat-main{
			padding-left: 32rpx;
			padding-right: 32rpx;
			padding-top: 100rpx;
		

			display: flex;
			flex-direction: column;
		}
		.chat-ls{
			.chat-time{
				font-size: 12px;
				color: rgba(39,40,50,0.30);
				line-height: 34rpx;
				padding: 20rpx 0;
				text-align: center;
			}
			.msg-m{
				display: flex;
				padding: 20rpx 0;
				.user-img{
					flex: none;
					width: 80rpx;
					height: 80rpx;
					border-radius: 10px;
				}
				.message{
					flex: none;
					max-width: 480rpx;
					
				}
				.msg-text{
					font-size: 16px;
					color: #272832;
					line-height: 44rpx;
					padding: 18rpx 24rpx;
				}
				.msg-img{
					max-width: 400rpx;
					border-radius: 20rpx;
				}
			}
			.msg-left{
				flex-direction: row;
				.msg-text{
					margin-left: 16rpx;
					background-color: #fff;
					border-radius: 0px 20rpx 20rpx 20rpx;
				}
				.msg-img{
					margin-left:16rpx;
				}
			}
			.msg-right{
				flex-direction: row-reverse;
				.msg-text{
					margin-right: 16rpx;
					background-color: rgba(255,228,49,0.8);
					border-radius: 20px 0rpx 20rpx 20rpx;
				}
				.msg-img{
					margin-right: 16rpx;
				}
			}
		}
		}
	.show-more{
		margin: 0 auto;
		opacity: 0.5;
	}
</style>
