<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap='backOne'>
				<image src="../../static/back.png" mode="" class="back-img"></image>
			</view>
			<view class="top-bar-center">
				<view class="title">好友请求</view>
			</view>
			<view class="top-bar-right">
				<view class="pice"></view>
			</view>
		</view>
		<view class="main">
			<view class="requester" v-for="(item,index) in requesters" :key="index">
				<view class="requester-top">
					<view class="reject btn" @tap="refuse(item.id)">拒绝</view>
					<view class="header-img">
						<image  :src="item.imgurl"  mode=""></image>
					</view>
					<view class="agree btn" @tap="agree(item.id)">同意</view>
				</view>
				<view class="request-center">
					<view class="title">{{item.name}}</view>
					<view class="time">{{changeTime(item.lastTime)}}</view>
				</view>
				<view class="notic">
					<text >留言：{{item.msg}}</text>
				</view>
			</view>
			<view class="noneRequest" v-if="requesters.length == 0">
				暂时没有用户添加您为好友
			</view>
		</view>
	</view>
</template>

<script>

	import myfun from '../../common/js/myfun.js'
	
	export default {
		data() {
			return {
				requesters:[],
				uid:'',
				myname:'',
				token:''
			};
		},
		methods:{
			//返回
			backOne:function(){
				uni.navigateBack({
					delta:1
				});
		},
		//获取时间修改
		changeTime: function(date){
			return myfun.dateTime(date);
		},
		getStorages:function(){
			try {
				
			    const value = uni.getStorageSync('user');
			    if (value) {
					//数据缓存存在
			        // console.log(value);
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
		//获取好友请求
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

					let status = data.data.status;
					if (status == 200) {
						let res = data.data.result; 
						for(let i=0;i<res.length;i++ ){
							this.getLeave(res,i)
						}
						this.requesters = res
						// console.log(res);
						
						
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
		//获取留言
		getLeave:function(arr,i){
			uni.request({
				url: this.serverUrl + '/index/getlastmsg',		
				data: {
					uid:this.uid,
					fid:arr[i].id,
					token:this.token,
				},
				method: "POST",
				success: (data) => {
					let status = data.data.status;
					if (status == 200) {
						let res = data.data.result; 	
						let e =arr[i];
						e.msg = res.message;
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
		//拒绝好友申请
		refuse:function(fid){
			uni.request({
				url: this.serverUrl + '/friend/deletefriend',		
				data: {
					uid:this.uid,
					fid:fid,
					token:this.token,
				},
				method: "POST",
				success: (data) => {
					let status = data.data.status;
					if (status == 200) {
						for(let i =0;i<this.requesters.length;i++){
							if(this.requesters[i].id == fid){
								this.requesters.splice(i,1);
							}
						}
						uni.showToast({
							title: '拒绝好友成功',
							duration: 2000, //显示时间
							icon: 'none'
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
		},
		//同意好友申请
		agree:function(fid){
			uni.request({
				url: this.serverUrl + '/friend/updatefriendstate',		
				data: {
					uid:this.uid,
					fid:fid,
					token:this.token,
				},
				method: "POST",
				success: (data) => {
					let status = data.data.status;
					console.log(data.data)
					if (status == 200) {
						for(let i =0;i<this.requesters.length;i++){
							if(this.requesters[i].id == fid){
								this.requesters.splice(i,1);
							}
						}
						uni.showToast({
							title: '添加好友成功',
							duration: 2000, //显示时间
							icon: 'none'
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
		},
	},
		onLoad() {
			this.getStorages();	
			// this.getRequesters();
			this.friendRequest();
		},
	}
</script>

<style lang="scss">
	@import "../../common/css/mycss.scss";
	.top-bar{
		background: rgba(255,255,255,0.96);
		border-bottom: 1px solid $uni-bg-color;
	}
	.main{
		padding: 108rpx $uni-spacing-row-base $uni-spacing-col-base;
		.requester{
				margin-top: 112rpx;
				padding: $uni-spacing-col-base;
				background: rgba(255,255,255,1);
				box-shadow: 0 rpx 24rpx 64rpx -8rpx rgba(0,0,0,0.1);
				border-radius: $uni-border-radius-base;
			}
			.requester-top{
				display: flex;
				flex-direction: row;
				.btn{
					flex: auto;
					text-align: center;
					width: 160rpx;
					height: 64rpx;
					background: rgba(255,93,91,0.1);
					border-radius: 40rpx;
					font-size: $uni-font-size-lg;
					line-height: 64rpx;
				}
				.reject{
					color: $uni-color-warning;
					background-color: rgba(255,93,91,0.1);
				}
				.agree{
					color: $uni-text-color;
					background-color: $uni-color-primary;
				}
				.header-img{
					margin-top: -104rpx;
					flex:auto;
					text-align: center;
					image{
						width: 144rpx;
						height: 144rpx;
						border-radius: 50%;
						background-color: $uni-color-primary;
					}
				}
			}
			.request-center{
				text-align: center;
				padding-top: 20rpx;
				padding-bottom: 40rpx;
				.title{
					font-size: 36rpx;
					font-weight: 500;
					color: $uni-text-color;
					line-height: 50rpx;
				}
				.time{
					font-size: $uni-font-size-sm;
					color: $uni-text-color-disable;
					line-height: 34rpx;
				}
				
			}
			.notic{
				padding: $uni-spacing-row-sm $uni-spacing-col-base;
				border-radius: $uni-border-radius-base;
				background-color: $uni-bg-color-grey;
				font-size: $uni-font-size-base;
				color: $uni-text-color;
				line-height: 40rpx;
			}
	}
	.noneRequest{
		position: absolute;
		left:25%;
		top:50%;
		font-size: 39rpx;
		animation: 3s infinite;
		animation-name: chagneColor;
	}
	@keyframes chagneColor
	{
	0%{
		color: rgba(112,128,144,1);
	}
	50%{
		color: rgba(112,128,144,0.39);
	}
	100%{
		color: rgba(112,128,144,1);
	}
	}
</style>
