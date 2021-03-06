<template>
	<view class="content">
		<view class="top-nav">
			<image class="back" src="../../static/back.png" mode="" @click="back"></image>
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
				<view class="text">注册</view>
			</view>
			<view class="singup-input">
				<view class="user">
					<image class="btn" src="../../static/sinup/uuser.png" mode=""></image>
					<input type="text" value="" placeholder="请输入用户名" @blur="matchUser"/>
					<view class="employ" v-if="useemploy">
						用户名已占有
					</view>
					<view class="employ message-user"  v-if="isuser">
						<image src="../../static/sinup/message-juged.svg" mode=""></image>
					</view>
				</view>
				<view class="">
					<image class="btn" src="../../static/sinup/email.png" mode=""></image>
					<input type="text" class="email" @blur="isEmail"  placeholder="请输入邮箱" />
					<view class="employ-email" v-if="emailemploy">已占用</view>
					<view class="invalid" v-if="invalid">邮箱无效</view>
					<view class="employ message-juged"  v-if="isemail">
						<image src="../../static/sinup/message-juged.svg" mode=""></image>
					</view>
				</view>
				<view class="input-div">
					<image class="btn" src="../../static/sinup/pwd.png" mode=""></image>
					<input :type="type" value="" placeholder="请输入密码" @input="getPwd"/>
						<image :src="lookurl" mode="" class="look" @tap="looks"></image>
				</view>
			</view>
			<view :class="[{signupNo:!isok},{signupOk:isok}]" @tap="signUp">
				注册
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
				type:'password',
				isuser:false,	//用户名是可用
				isemail:false,	//邮箱是可用
				look:false,		//是否显示密码
				invalid:false,//邮箱是否成立
				useemploy:false, //是否被占有
				emailemploy:false, //邮箱是否被占有
				lookurl:'../../static/sinup/BIYAN.png',
				email:'',
				user:'',          //用户名
				pwd:'',
				isok:false,
				employ:'',
			};
		},
		computed:{
			//判断注册
			isOk:function(){
				if(this.isuser && this.isemail && this.pwd.length>5){
					this.isok = true;
						
				}else{
					this.isok = false;
				}
			}
		},
		methods:{
			//密码隐藏
			looks:function(){
			
				if(this.look){
					
					this.type="password";
					this.look=!this.look;
					this.lookurl='../../static/sinup/BIYAN.png'
				}else{
						console.log('111')
					this.type="text";
					this.look=!this.look;
					this.lookurl='../../static/sinup/CHA.png'
				}
			},
			back(){
				console.log('1')
				uni.navigateTo({
					url:'../login/login',
				});
			},
			isEmail:function(e){
			let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
			this.email = e.detail.value;
			if(this.email.length>0){
				if(reg.test(this.email)){
					this.invalid = false;
					//后端验证邮箱是否被占用
					this.matchMail();
				}else{
					this.invalid = true;
					this.emailemploy = false;
					this.isemail = false;
				}
			}
			else{
				this.invalid = false;
				this.emailemploy=false;
				this.isemail = false;
				this.isOk;
			}
			},
			//匹配邮箱
			matchMail:function(e){
					uni.request({
						url:this.serverUrl+'/signup/judge',
						data:{
							data:this.email,
							type:'email',
						},
						method:'POST',
						success:(data) =>{
							// console.log(data);
							let status = data.data.status;
							//访问后端成功
							if(status == 200){
								let res = data.data.result;
								if(res>0){
									//表示邮箱已存在
									this.emailemploy = true;
									this.isemail = false;
								}else{
									//表示邮箱不存在
									this.emailemploy = false;
									this.isemail = true;
								}
								this.isOk;
							}else if(status == 500){
								uni.showToast({
									title:'服务器出错了！！！',
									duration:2000,
									icon:'none',
								});
							}
						}
					})
				
					
			},
			matchUser:function(e){
				console.log(e.detail.value)
				this.user = e.detail.value;
				if(this.user.length>0){
					uni.request({
						url:'http://localhost:3000/signup/judge',
						data:{
							data:this.user,
							type:'name',
						},
						method:'POST',
						success:(data) =>{
							console.log(data); 
							let status = data.data.status;
							//访问后端成功
							if(status == 200){
								let res = data.data.result;
								if(res>0){
									//表示用户名已存在
									this.useemploy = true;
									this.isuser = false;
								}else{
									//表示用户名不存在
									this.useemploy = false;
									this.isuser = true;
								}
								this.isOk;
							}else if(status == 500){
								uni.showToast({
									title:'服务器出错了！！！',
									duration:2000,
									icon:'none',
								});
							}
						}
					})
				}
				else{
					this.useemploy = false;
					this.isuser = false;
					this.isOk;
				}
			},
			signUp:function(){
				if(this.isok){
					uni.request({
						url:this.serverUrl+"/signup/add",
						data:{
							mail: this.email,
							name: this.user,
							pwd: this.pwd
						},
						method:'POST',
						success:(data) =>{
							console.log(data);
							let status = data.data.status;
							//访问后端成功
							if(status == 200){
								console.log(this.user+'注册成功')
								//注册成功跳转到登录页面
								uni.navigateTo({
									url:'../login/login?user='+this.user,
								});
							}else if(status == 500){
								uni.showToast({
									title:'服务器出错了！！！',
									duration:2000,
									icon:'none',
								});	
							}
						}
					})
				}
			},
			//获取密码
			getPwd:function(e){
				this.pwd = e.detail.value;
				this.isOk;
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
		.back{
			margin-top: 10rpx;
			width:77rpx;
			height: 77rpx;
			box-sizing: border-box;
			padding: 10rpx;
		}
	}
	.logo{
			margin-left: -270rpx;
			width: 150rpx;
			height: 150rpx;
			
		}
	.invalid{
			color: red;
	}
	.btn{
			position: absolute;
			left: 50rpx;
			z-index:5;
			width: 50rpx; /*设置图片显示的宽*/
			height: 50rpx; /*图片显示的高*/
		}	
	.signup-main{
		display: grid;
		grid-auto-rows: 260rpx 100rpx 1fr 96rpx 1fr;
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
			width: 112rpx;
			height: 80rpx;
			font-family: PingFangSC-Medium;
			font-size: 28px;
			color: rgba(25,25,112,1);
			letter-spacing: 0;
			padding-left: 20rpx;
		}
		.singup-input{
			display: grid;
			grid-auto-rows: repeat(3,1fr);
			text-align: left;
			padding: 50rpx;
			input{
				padding-left: 70rpx;
				border-bottom:1px solid $uni-border-color
			}
			position: relative;
		}
		.message-user{
			top:20rpx;
			image{
				width: 84rpx;
				height: 64rpx;
			}
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
		.employ-email{
			position: absolute;
			right: 50rpx;
			top:130rpx;
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
		.signupNo{
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
	.input-div{
		position: relative;
		.look{
			position: absolute;
			right: 15rpx;
			top: -10rpx;
			width: 64rpx;
			height: 64rpx;
		}
		.btn{
				position: absolute;
				left: 0rpx;
				z-index:5;
				width: 50rpx; /*设置图片显示的宽*/
				height: 50rpx; /*图片显示的高*/
			}
	}
</style>
