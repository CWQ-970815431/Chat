<template>
	<view class="main">
		<view class="main-nav">
			<view class="main-nav-text">
				聊天
			</view>
		</view>
		<view class="main-search">
			<image class="logo" src="../../static/main/search.svg" mode=""></image>
			<input class="main-input" type="text" value="" placeholder="搜索" @tap="toSearch"/>
		</view>
		<view class="noone" v-if="!friends.length && requestData <1">
			<image src="../../static/chat/alone.png" mode="aspectFill"></image>
			<view class="no-title">一个好友也没有</view>
			<view class="search-bt" @tap="toSearch">搜索好友	</view>
		</view>
		<view class="main-content" >
			<view class="refresh" v-if="refresh">
				<image src="../../static/chat/refresh.png"></image>
				<view class="ref-title"> 下拉刷新</view>
			</view>
			
			<view class="friends" v-if ="requestData > 0 " @tap="getRequest">
				<view class="friend-list">
					<view class="friend-list-l">
						<text class="tip">{{requestData}}</text>
						<image src="../../static/chat/apply.png" mode=""></image>
					</view>
					<view class="friend-list-r" >
						<view class="top">
							<view class="name">好友申请</view>
							<view class="time">{{changeTime(requestTime)}}</view>
						</view>
						<view class="news">有新的好友申请</view>
					</view>
				</view>
			</view>
			<view class="friends list" >
			<view class="friend-list" v-for="(item,index) in friends":key="item.id">
					<view class="friend-list-l">
						<text class="tip" v-if="item.tip>0">{{item.tip}}</text>
						<navigator :url="'../userhome/userhome?id='+item.id"  hover-class="none" >
							<image :src="item.imgurl"></image>
						</navigator>
					
					</view>
					<view class="friend-list-r" @tap="chatroom(item)"  >
						
						
						<view class="top">
							<view class="name">{{item.name}}</view>
							
									<view class="time">{{changeTime(item.lastTime)}}</view>
							
						</view>
						<view class="news">{{item.msg}}</view>
					</view>
					
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	import datas from '../../common/js/datas.js'
	import myfun from '../../common/js/myfun.js'
	export default {
		data() {
			 return {
				uid:''	,//用户id
				imgurl:'',	//用户头像
				token:'',	//token
				friends: [],	//好友列表
				requestData:1,		//好友申请数
				requestTime:'',		//最后申请时间
				myname:'',
				refresh:true, //下拉刷新
		}
		},
		onLoad() {
		
			this.getStorages();
			this.friendRequest();
			this.getFriends();
		        },
		
		 onPullDownRefresh() {
			 this.friends=[]
			 this.getStorages();
		        this.friendRequest();
		        this.getFriends();
		        setTimeout(function () {
		            uni.stopPullDownRefresh();
		        }, 1000);
		    },		
		methods:{
			chatroom:function(e){
				console.log(e)
				uni.navigateTo({
					url:'../chatroom/chatroom?id='+e.id+'&name='+e.name+'&img='+e.imgurl+'&type='+e.type
				})
			},
			getRequest:function(){
				uni.navigateTo({
					url:'../friendrequest/friendrequest'
				})
			},
			toSearch:function(){
				uni.reLaunch({
					url:'../search/search',
				})
			},
			//好友请求
			friendRequest:function(){
				uni.request({
					url: this.serverUrl + '/index/getfriend',		
					data: {
						uid:this.uid,
						state:1,
						token:this.token,
					},
					method: "POST",
					success: (data) => {
						
						// console.log(data)
						let status = data.data.status;
						if (status == 200) {
							let res = data.data.result; 
							// console.log(res);
							if(res.length == this.requestData){
								this.refresh = false
							}
							this.requestData = res.length;
							if(res.length>0){
								this.requestTime = res[0].lastTime;
								for(let i = 0;i<res.length;i++){
									if(this.requestTime<res[i].lastTime){
										this.requestTime = res[i].lastTime;
									}
								}
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
			},
			//获取好友列表
			getFriends:function(){
				uni.request({
					url: this.serverUrl + '/index/getfriend',		
					data: {
						uid:this.uid,
						state:0,
						token:this.token,
					},
					method: "POST",
					success: (data) => {
					
						let status = data.data.status;
						if (status == 200) { 
							let res = data.data.result; 
							
							if(res.length > 0 ){
								for(let i = 0;i<res.length;i++){
									this.friends.push(res[i]);
									if(res[i].markname){
										res[i].name = res[i].markname
									}
								}
								
								for(let i = 0;i<res.length;i++){
									this.getLastMsg(this.friends,i);
									this.getUnread(this.friends,i);
								}
								console.log(this.friends)
							}
							let a= myfun.Msort(this.friends,'lastTime',0);
							if( a == this.friends){
								this.refresh = false
							}
							this.friends = a
							//群列表
							// this.getGroup();
							
							
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
			},
			//获取最后消息
			getLastMsg:function(arr,i){
				uni.request({
						url: this.serverUrl + '/index/getlastmsg',		
						data: {
							uid:this.uid,
							fid:arr[i].id,
							token:this.token,
						},
						method: "POST",
						success: (data) => {
							console.log(data)
							let status = data.data.status;
							if (status == 200) {
								
								let res = data.data.result;
								console.log(res);
								if(res.types == 0){
									//最后消息为文字
								}else if(res.types == 1){
									//图片
									res.message = '[图片]';
								}else if(res.types == 2){
									//音频
									res.message = '[音频]';
								}else if(res.types == 3){
									//地图
									res.message = '[位置]';
								}
								let e = arr[i];
								
								e.msg = res.message;
								// console.log(e);	
								arr.splice(i,1,e);
								
							} else if (status == 500) {
								
								uni.showToast({
									title: '最后消息失败出错了！',
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
			//获取未读消息数
			getUnread:function(arr,i){
				uni.request({
						url: this.serverUrl + '/index/unreadmsg',		
						data: {
							uid:this.uid,
							fid:arr[i].id,
							token:this.token,
						},
						method: "POST",
						success: (data) => {
							// console.log(data)
							let status = data.data.status;
							if (status == 200) {
								
								let res = data.data.result; 
								
								let e = arr[i] ;
								e.tip = res;
								
								arr.splice(i,1,e);
								
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
			},
			// //获取群列表
			// getGroup:function(){
			// 	uni.request({
			// 		url: this.serverUrl + '/index/getgroup',		
			// 		data: {
			// 			uid:this.uid,
			// 			token:this.token,
			// 		},
			// 		method: "POST",
			// 		success: (data) => {
			// 			console.log(data+'群')
			// 			let status = data.data.status;
			// 			if (status == 200) {
			// 				let res = data.data.result; 
			// 				if(res.length> 0 ){
			// 					for(let i = 0;i<res.length;i++){
			// 						res[i].imgurl = this.serverUrl+'/user/'+res[i].imgurl;
			// 					}
			// 				}
			// 				console.log(res);
			// 			} else if (status == 500) {
			// 				uni.showToast({
			// 					title: '服务器出错了！',
			// 					duration: 2000, //显示时间
			// 					icon: 'none'
			// 				})
			// 			}else if (status == 300) {
			// 				//token过期
			// 				uni.navigateTo({
			// 					url:'../signin/signin?name='+this.myname
			// 				})
			// 			}
			// 		}
			// 	})
			// },
			//获取缓存
			getStorages:function(){
				try {
					
				    const value = uni.getStorageSync('user');
				    if (value) {
						//数据缓存存在
				        // console.log(value);
						this.uid =value.id;
						this.imgurl = value.imgurl;
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
			changeTime: function(date){
				return myfun.dateTime(date);
			},
		}
	}
</script>

<style lang="scss">
	*{
		margin: 0;
		padding: 0;
		
	}
	.main{
		width: 100vh;
		height: 100vh;
		display: grid;
		grid-template-rows: 100rpx 100rpx 1fr;
		// background-color: #333333;
	}
	.noone{
	padding-left: 250rpx;
	padding-top: 230rpx;
		image{
			padding-left: 40rpx;
			width: 158rpx;
			height: 250rpx;
		}
		.no-title{
			padding-left: 15rpx;
			padding-top: 15rpx;
			width: 300rpx;
			height: 40rpx;
				padding-bottom: 30rpx;
				font-size: 14px;
				color: rgba(39,40,50,0.60);
		}
		.search-bt{
		
			text-align: center;
			line-height: 80rpx;
			width: 240rpx;
			height: 96rpx;
			background: #FFE431;
			box-shadow: 0 26px 18px -16px rgba(255,228,49,0.40);
			border-radius: 24px;
			border-radius: 24px;
			font-family: PingFangSC-Regular;
			font-size: 14px;
			color: #272832;
			letter-spacing: -0.48px;
		}
		}
	.refresh{
		position: absolute;
		top:950rpx;
		left:40%;
		image{
			padding-left: 39rpx;
			width: 32rpx;
			height: 32rpx;
		}
		.ref-title{
			
			padding-top: 10rpx;
			width: 210rpx;
			font-size: 28rpx;
			height: 40rpx;
		
			color: rgba(39,40,50,0.4);
		}
		
	}
	.main-nav-text{
		margin-left: 105rpx;
		color: #333333;
	}
	
	.main-nav{
		width: 100vw;
		height:100rpx ;
		display: grid;
		text-align: center;
		grid-template-columns: 1fr 130rpx;
		line-height: 100rpx;
		font-size: 39rpx;
		color: #FFFFFF;
		.logo{
			width:70rpx;
			height: 100rpx;
			box-sizing: border-box;
			padding: 10rpx;
			display: inline-block;
		}
	}
	.main-search{
		padding-top:20rpx;
		image{
			position: absolute;
			z-index: 2;
			top:10rpx
		}
		.main-input{
			width: 600rpx;
			height: 70rpx;
			margin-left: 30rpx;
			background-color:#ebebec!important;
			border-radius: 35rpx;
			padding-left: 80rpx;
		}
		.logo{
			width:70rpx;
			height: 100rpx;
			box-sizing: border-box;
			padding: 10rpx;
			margin-left: 40rpx;
			margin-top: 95rpx;
		}
	}
	.list{
	}
	.friends{
		padding: 5px;
		}
	.friend-list{
			height: 96rpx;
			padding: 10rpx 20rpx;
			margin-bottom: 10px;
			&:active{
				background-color: $uni-bg-color-grey;
			}
			.friend-list:after{
				clear: both;
				}
			.friend-list-l{
				position: relative;
				display: flex;
				width: 100rpx;
				image {
					// padding-left: 30rpx;
					width: 96rpx;
					height: 96rpx;
					border-radius: $uni-border-radius-base;
					background-color: $uni-color-primary;
				}
				.tip {
					position: absolute;
					z-index: 10;
					top: -8rpx;
					left:68rpx;
					min-width: 20rpx;
					height: 36rpx;
					background: $uni-color-warning;
					border-radius: 18rpx;
					padding: 0 8rpx;
					font-size: $uni-font-size-sm;
					color: $uni-text-color-inverse;
					line-height: 36rpx;
					text-align:center;
				}
			}
			.friend-list-r {
				padding-left:128rpx;
				margin-top: -100rpx;
				z-index: 2099;
				.top {
					height: 50rpx;
					.name {
						float: left;
						font-size: 36rpx;
						font-weight: 400;
						line-height:50rpx;
						 }
					.time {
						position: absolute;
						right: 50rpx;
						font-size: $uni-font-size-sm;
						color: $uni-text-color-disable;
						line-height:50rpx;
						color: #333333;
						  }
					}
				}
				.news {
					
					font-size: $uni-font-size-base;
					color: $uni-text-color-grey;
					line-height: 40rpx;
					display: -webkit-box ;
					-webkit-box-orient : vertical;
					-webkit-line-clamp : 1;
					overflow: hidden;
				}
			
			}
	
</style>
