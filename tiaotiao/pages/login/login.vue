<template>
	<view class="content">
		<view class="top-nav">
			<view class="login-tosignup" @click="toSignUp">
				注册
			</view>
		</view>
		<view class="signup-main">
			<view class="">
			<image  class="logo" src="../../static/logo.png" mode=""></image>
			<view class="logo-main">
				<view class="logo-title-o">
					爱宠码头
				</view>
				<view class="logo-title-t">
					探索未知的神秘世界
				</view>
			</view>
			</view>
			<view class="">
				<view class="text" >登录</view>
			</view>
			<view class="singup-input">
				<view class="user">
				<image class="btn" src="../../static/sinup/uuser.png" mode=""></image>
					<input type="text" v-model="user" value="" placeholder="用户名/邮箱" class="user" placeholder-style="color:#aaa;font-weight:400;" @input="userput"/>
	
				</view>
				<view class="">
					<image class="btn" src="../../static/sinup/pwd.png" mode=""></image>
					
					<input type="password" v-model="pwd" value="" placeholder="密码"  class="pwd" placeholder-style="color:#aaa;font-weight:400;" @input="userput"/>
					<view class="tips" :style="{display:mon}">
						输入用户名或密码错误！
					</view>	
				</view>
			</view>
			<view :class="[{sinupbtn:!isok},{signupOk:isok}]" @click="login" >
				登录
			</view>
			<view class="">
				
			</view>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				user:'',
				pwd:'',
				token:'',
				mon:'none',
				isok:false,
				userputd:false,
				pwdputd:false,
				
			};
		},
		onLoad:function(e){
			// console.log(e)
			if(e.user){
				this.user = e.user;
				uni.showToast({
					title:'注册成功请登录',
					icon:'none',
					duration:2000
				})
			}else if(e.name){
				this.user = e.name;
				uni.showToast({
					title:'登录已过期，请重新登录',
					icon:'none',
					duration:2000
				})
			}else if(e.cgpwd){
				this.user = e.cgpwd;
				uni.showToast({
					title:'登录已过期，请重新登录',
					icon:'none',
					duration:2000
				})
			}
		},
		methods: {
			//跳转注册页面
			toSignUp:function(){
				uni.redirectTo({
					url:'../signup/signup'
				});
			},
			
			//用户输入
			userput:function(){
				if(this.pwd.length > 5){
					this.pwdputd = true
				}else{
					this.pwdputd = false
				}
				if(this.user.length>0){
					this.userputd = true
				}else{
					this.userputd = false
				}
				this.isOk();
			},
			
			isOk:function(){
				if(this.userputd && this.pwdputd){
					this.isok = true;
				}else{
					this.isok = false;
				}
			},
			
			
			
			//登录提交
			login:function(){
				if(this.user && this.pwd){		//用户和密码都存在才提交
					// console.log("提交")
					uni.request({
						url:this.serverUrl+'/signin/match',
						data: {
							data: this.user,
							pwd: this.pwd
						},
						method: "POST",
						success: (data) => {
					
							let status = data.data.status;
							if(status == 200){
								//登录成功
								this.mon = "none"
								let res = data.data.back;
								// console.log(res)
								//本地存储用户信息 数据缓存
								try{
									uni.setStorageSync('user',{
										'id':res.id,
										'name':res.name,
										'imgurl':res.imgurl,
										'token':res.token,
										'email':res.email,
										'pwd':res.pwd,
										
										
									});
								}catch(e){
									//error
									console.log('数据存储出错');
								}
								if(res.petName && res.petName != 'alone'){
									// 跳转到首页
										uni.switchTab({
											url:'/pages/index/index'
										});	
								}else{
									uni.navigateTo({
										url:'/pages/petchoose/petchoose'
									})
								}
								
							
							}
							else if(status == 400){
								//用户匹配失败
								this.mon ='block'
								this.pwd ="";
								this.userput();
								uni.showToast({
									title:'用户名或密码错误',
									icon:'none',
									duration:1500
								})
								
							}else if (status == 500) {
								//服务器失败
								uni.showToast({
									title: '服务器出错了！',
									duration: 2000, //显示时间
									icon: 'none'
								})
							}
							
						}
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.content{
		width: 100vw;
		height: 100vh;
		display: grid;
		grid-auto-rows: 88rpx 1fr;
	}
	.top-nav{
		.login-tosignup{
			margin-top: 10rpx;
			margin-right: 10rpx;
			width:100rpx;
			height: 80rpx;
			box-sizing: border-box;
			float: right;
			color: #F1F1F1;
			padding-left: 20rpx;
			line-height: 80rpx;
			background-color: rgba(25,25,112,0.7);
			border-radius: 12rpx;
		}
	}
	.logo{
			margin-left: -270rpx;
			width: 150rpx;
			height: 150rpx;
			
		}
	.btn{
		position: absolute;
		left: 50rpx;
		z-index:5;
		width: 50rpx; /*设置图片显示的宽*/
		height: 50rpx; /*图片显示的高*/
	}	
	.tips{
		color: red;
	}
	.signup-main{
		display: grid;
		grid-auto-rows: 260rpx 100rpx 0.7fr 96rpx 1fr;
		text-align: center;
		.logo-main{
		margin-top: -130rpx;
		margin-left: 170rpx;
		display: flex;
		flex-direction: column;
		.logo-title-o{
			margin-left: -80rpx;
			font-size: 50rpx;
			display: block;
			color: rgba(25,25,112,1);
		}
		.logo-title-t{
			font-size: 30rpx;
			display: block;
				color: rgba(25,25,112,0.6);
		}
		 
	}
		
		.text{
			width: 120rpx;
			height: 80rpx; 
			font-family: PingFangSC-Medium;
			font-size: 28px;
			color:rgba(25,25,112,1);
			letter-spacing: 0;
			padding-left: 20rpx;
		}
		.singup-input{
			display: grid;
			grid-auto-rows: repeat(2,1fr);
			text-align: left;
			padding: 50rpx;
			
			input{
				padding-left: 70rpx;
				border-bottom:1px solid $uni-border-color;
				// width:100%
			}
			position: relative;
		}

		.employ {
			position: absolute;
			right: 50rpx;
			top: 30rpx;
			font-size: $uni-font-size-lg;
			font-weight: 500;
			color: $uni-color-warning;
			line-height: 88rpx;
		}
		.message-juged{
			right: 50rpx;
			top: 150rpx;
			image{
				width: 84rpx;
				height: 64rpx;
			}
		}
		.sinupbtn{
			display: inline;
			width: 520rpx;
			height: 96rpx;
			line-height: 96rpx;
			background: rgba(39,40,50,0.20);
			border-radius: 24px;
			text-align: center;
			position: relative;
			left:120rpx;
			color: #FFFFFF;
		}
		.signupOk{
			display: inline;
			width: 520rpx;
			height: 96rpx;
			line-height: 96rpx;
			background: $uni-color-primary;	
			border-radius: 24px;
			text-align: center;
			position: relative;
			left:120rpx;
			color: #FFFFFF;
		}
	}
</style>
