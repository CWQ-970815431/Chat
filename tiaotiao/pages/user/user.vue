<template>
	<view class="content">
		<view class="top-bar">
				<image class="bk-user" src="../../static/user/BK2.jpg" mode=""></image>
				<navigator :url="'../userhome/userhome?id='+this.id"  hover-class="none" >
				
					<image class="user-img" :src="imgurl" mode="" ></image>
				</navigator>
				<view class="user-name">
					{{uname}}
				</view>
				
				<navigator :url="'../userdetials/userdetials?id='+this.id+'&back='+this.back"  hover-class="none" >
					<image class="btn setting" src="../../static/user/setting.png" mode="" ></image>
				</navigator>
		</view>
		<view class="main-content">
			<view class="content-list" @tap="tofriend">
				<image class="btn" src="../../static/user/list/myfriend.png" mode=""></image>
			
				<view class="title">
					我的好友
				</view>
			
				<image class="btn" src="../../static/user/go.png" mode=""></image>
			</view>
			<view class="content-list"  @tap="checkPet">	
				<image class="btn" src="../../static/user/pet.png" mode=""></image>
			<!-- 	<navigator class="title" :url="'../pethave/pethave?id='+this.id">	 -->
			<view class="title" >
			
					我的宠物
			
			</view>
				
				
				<!-- </navigator> -->
				<image class="btn" src="../../static/user/go.png" mode=""></image>
			</view>
			<view class="content-list" @tap="getRequest">
				<image class="btn" src="../../static/user/list/friend.png" mode=""></image>
				<view class="title" >
					邀请我的好友
				</view>
				<image class="btn" src="../../static/user/go.png" mode=""></image>
			</view>
			<view class="content-list" @tap="toMyforum">
				<image class="btn" src="../../static/user/list/release.png" mode=""></image>
				<view class="title">
					我的发布
				</view>
				<image class="btn" src="../../static/user/go.png" mode=""></image>
			</view>
			<view class="content-list">
				<image class="btn" src="../../static/user/list/star.png" mode=""></image>
				<view class="title" @tap="toStarforum">
					我的收藏
				</view>
				<image class="btn" src="../../static/user/go.png" mode=""></image>
			</view>
			
			
			
			
			
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				back:true,
				imgurl:'../../static/sinup/logo.jpg',
				uname:'1',
				useremail:'1',
				id:'',
			};
		},
		onLoad(e) {
			if(e){
				this.uname == e.name
			}
		},
		onShow(){
					this.getStorage()
				},
		methods:{
			toMyforum:function(){
				uni.navigateTo({
					url:'../myForum/myForum'
				})
			},
			toStarforum:function(){
				uni.navigateTo({
					url:'../startForum/startForum'
				})
			},
			getStorage:function(){
				const value = uni.getStorageSync('user')
				if(value){
						this.imgurl = value.imgurl
						this.uname = value.name
						 this.useremail =value.email
						 this.id = value.id
				}
				else{
					//如果没有数据缓存，跳转到登陆页面
					uni.redirectTo({
						url:'../login/login',
					})
				}
				
					
			},
			//跳转到好友
			tofriend:function(){
				uni.switchTab({
					url:'../friend/friend'
				})
			},
			getRequest:function(){
				uni.navigateTo({
					url:'../friendrequest/friendrequest'
				})
			},
			checkPet:function(){
				
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
									if(res.petName == 'alone'){
										uni.showModal({
											title:'提示',
											content:'您未成功填入您的爱宠信息，是否现在添加?',
											success:(res)=>{
												if(res.confirm){	//点击确定
													uni.navigateTo({
														url:'/pages/petchoose/petchoose'
													})
												} 
												else if(res.cancel){
													
												}
											}
											})
											
										}
										else{
											uni.navigateTo({
												url:'../pethave/pethave?id='+this.id
											})
										}
									
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
				
			}
			
		}
	}
</script>

<style lang="scss">
	.content{
		height: 100vh;
		width: 100vw;
			background-color:rgba(220,220,220,0.5);
		
	}
	.btn{
		margin: 23rpx;
		width: 66rpx;
		height: 66rpx;
	}
	.top-bar{
			.bk-user{
				width: 100%;
				height: 30vh;
			}
			.user-img{
				position: absolute;
				top:170rpx;
				left:300rpx;
				line-height: 150rpx;
				width: 150rpx;
				height: 150rpx;
				border-radius: 50px;
				display: inline-block;
			}
			.setting{
			
				position: absolute;
				top:90rpx;
				right: 10rpx;
			}
			.user-name{
				position: absolute;
				top:330rpx;
				left:310rpx;
				text-align: center;
				width: 17%;
				color: #191970;
			
			}
		
	
		}
	.main-content{
		background-color:rgba(220,220,220,0.5);
		width: 100%;
		height: 70vh;
		.content-list{
			background-color:#FFFFFF;	
			display: flex;
			height: 110rpx;
			margin: 10rpx;
			.title{
				color:#191970;
				margin: 35rpx;
				flex: 1;
			}
			
			
		}
	}	
	
</style>
