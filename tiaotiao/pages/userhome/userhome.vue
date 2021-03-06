<template>
	<view>
		<view class="top-bar">
			<view class="top-bar-left" @tap='backOne'>
				<image src="../../static/back.png" mode="" class="back-img"></image>
			</view>
			<view class="top-bar-right">
				<view class="more-img"  v-if="relation == 0 || 	relation == 1 || relation == 2" @tap="userDetial">
					<image src="../../static/img/userhome/more.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="bg">
			<view class="bg-bai" :animation="animationData4"></view>
			<image class="bg-img"  :src="user.imgurl" mode="aspectFill"></image>
		</view>
		<view class="main">
			<view class="user-header">
				<view class="sex" :style="{background:sexBg}"  :animation="animationData3">
						<image :src="seximg" mode=""></image>
				</view>
				<image class="user-img" :src="user.imgurl" mode="aspectFill" :animation="animationData2"></image>
			</view>
			<view class="user-imf">
				<view class="name">	{{markname}}</view>
				<view class="nick">	昵称:{{user.name}}</view>
				<view class="intr">	{{user.explain}}</view>
			</view>
		</view>
		<view class="pet">
			<navigator :url="'../pethave/pethave?id='+this.id">	
			<image :src="user.petImg" mode=""></image>
			</navigator>	
			<view class="">
				{{user.petName}}
			</view>
		</view>
			
		<view class="bottom-bar">
			<view class="bottom-btn btn1" v-if="relation == 2" @tap="addFriendBtn">加为好友</view>
			<view class="bottom-btn btn1" v-if="relation == 1" @tap="chathim">发送消息</view>
		</view>
		<view class="add-misg" :style="{height:addHeight+'px',bottom:'-'+addHeight+'px'}" :animation="animationData">
			<view class="name">{{user.name}}</view>
			<textarea v-model="text_data" maxlength="120" class="add-main"></textarea>
		</view>
		<view class="add-bt bottom-bar" :animation="animationData1">
			<view class="close btn1" @tap="addFriendAnimat">取消</view>
			<view class="send btn1" @tap="addFriendSubmit">发送</view>
		</view>
	</view>
</template> 

<script>
	export default {
		data() {
			return {
				id:'',					//对象
				uid:'',					//用户id
				token:'',
				myname:'',
				relation:'',    //用户关系 0表示自己 1表示好友 2表示非好友
				markname:'',
				seximg:'../../static/img/userhome/female.png', 		//性别
				user:{},
				addHeight:'1000',
				sexBg:'',
				text_data:'',					//请求信息	
				animationData:{}, ///动画
				animationData1:{}, ///动画
				animationData2:{}, ///动画
				animationData3:{}, ///动画
				animationData4:{}, ///动画
				isAdd:false,
				
			};
		},
		onLoad:function(e){
			this.id = e.id;
			this.getStorages();
			this.getUser();
			this.judegeFriend();
		},
		onReady:function(){
			this.getElementStyle();
		},
		methods:{
			//跳转到用户详情页面
			userDetial:function(){
				uni.navigateTo({
					url:'../userdetials/userdetials?id='+this.id,
				})
			},
			//获取缓存数据
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
			//判断用户关系
			//获取用户信息
			getUser:function(){
				uni.request({
					url:this.serverUrl+'/user/detial',
					data:{
						id:this.id,
						token:this.token,
					},
					method:'POST',
					success:(data) =>{
					
						let status = data.data.status;
						//访问后端成功
						if(status == 200){
							let res = data.data.result[0];
							//获取头像
							// console.log(res)
					
							//获取简介
							if(typeof(res.explain)){
								res.explain = '这个人很懒，什么也没留下~'
							}
							//处理markname
							if(this.markname.length == 0 ){
								this.markname = res.name
							}
							this.sexJudge(res.sex)
							this.user = res;
							console.log(this.user)
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
			//发送信息
			chathim:function(){
				uni.navigateTo({
					url:'../chatroom/chatroom?id='+this.user._id+'&name='+this.user.name+'&img='+this.user.imgurl+'&type='
				})
			},
			//性别判断
			sexJudge:function(e){
				if(e == 'female'){
					this.seximg = '../../static/img/userhome/female.png'
					this.sexBg = 'rgba(255,93,91,1)'
				}else if(e == 'male'){
					this.seximg = '../../static/img/userhome/male.png'
					this.sexBg = 'rgba(87,153,255,1)'
				}else{
					this.seximg = '../../static/img/userhome/asexual.png'
					this.sexBg = 'rgba(39,40,50,1)'
				}
			},
			//判断用户关系
				judegeFriend:function(){
					if(this.id == this.uid){
						this.relation =0;
					}
					else{
						uni.request({
							url:this.serverUrl+'/search/isfriend',
							data:{
								uid:this.uid,
								fid:this.id,
								token:this.token,
							},
							method:'POST',
							success:(data) =>{
							
								let status = data.data.status;
								//访问后端成功
								if(status == 200){
									//好友
									this.relation = 1;
									this.getMarkName();
								}else if(status == 400){
									this.relation = 2;
									//非好友
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
				//获取好友昵称
				getMarkName : function(){
					uni.request({
						url: this.serverUrl + '/user/getmarkname',		//判断是否为好友
						data: {
							uid:this.uid,
							fid:this.id,
							token:this.token,
						},
						method: "POST",
						success: (data) => {
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
				},
			//返回登录页面
			backOne:function(){
				let pages = getCurrentPages();  // 获取当前页面栈层数     例如16
				    let backPages = pages.length - 1;  // 当前层数减一获取要跳转的页面的层数   15
				        uni.navigateBack({
				             delta: backPages         //跳转十五层  回到第一层页面
				        })
				
			},
			//获取页面高度
			getElementStyle:function(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.bg').boundingClientRect(data => {
					// console.log("得到布局位置信息"+ JSON.stringify(data));
					// console.log("节点离页面顶部得距离为"+ data.top);
					this.addHeight =data.height-186;
				}).exec();
			},
			//添加好友动画
			addFriendAnimat:function(){
				this.isAdd = !this.isAdd
				var animation = uni.createAnimation({
					duration:300,
					timingFunction:'ease',
				})
				var animation1 = uni.createAnimation({
					duration:300,
					timingFunction:'ease',
				})
				var animation2 = uni.createAnimation({
					duration:300,
					timingFunction:'ease',
				})
				var animation3 = uni.createAnimation({
					duration:300,
					timingFunction:'ease',
				})
				var animation4 = uni.createAnimation({
					duration:300,
					timingFunction:'ease',
				})
				
				if(this.isAdd){
					animation.bottom(0).step()
					animation1.bottom(0).step()
					animation2.width(120).height(120).step()
					animation3.opacity(0).step()
					animation4.backgroundColor('rgba(255,228,49,0.6)').step()
				}
				else{
					animation.bottom(-this.addHeight).step()
					animation1.bottom(-100).step()
					animation2.width().height().step()
					animation3.opacity(1).step()
					animation4.backgroundColor('rgba(255,228,49,0)').step()
				}
				
				this.animationData = animation.export()
				this.animationData1 = animation1.export()
				this.animationData2 = animation2.export()
				this.animationData3 = animation3.export()
				this.animationData4 = animation4.export()
			},
			//添加好友按钮
			addFriendBtn:function(){
				this.text_data = this.myname+' 请求添加好友~~';
				this.addFriendAnimat()
			},
			//确定添加好友
			addFriendSubmit:function(){
				if(this.text_data.length >0){
					this.addFriendAnimat();
					uni.request({
						url: this.serverUrl + '/friend/applyfriend',		//申请为好友
						data: {
							uid:this.uid,
							fid:this.id,
							msg:this.text_data,
							token:this.token,
						},
						method: "POST",
						success: (data) => {
							// console.log(data)
							let status = data.data.status;
							if (status == 200) {
								uni.showToast({
									title: '好友请求发送成功！',
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
				}
			},
			
		},
		
	}
</script>

<style lang="scss">
	@import "../../common/css/mycss.scss";
	.bg{
		position: fixed;
				z-index: -2;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		.bg-bai{
			width: 100%;
			height: 100%;
		}
		.bg-img{
			opacity: 0.4;
			position: absolute;
			z-index: -1;
			left: -10rpx;
			top: -10rpx;
			width: 110%;
			height: 110%;
			filter: blur(16rpx);
			
		}
	}
	
	.main{
		text-align: center;
		padding-top: 123rpx;
		.user-header{
			margin: 0 auto;
			width: 412rpx;
			height: 412rpx;
			position: relative;
			.sex{
				z-index: 11;
				position: absolute;
				bottom: 22rpx;
				right: 22rpx;
				width: 64rpx;
				height: 64rpx;
				border-radius:$uni-border-radius-circle;
				image{
					padding: 16rpx;
					width:32rpx;
					height: 32rpx;
				}
			}
			.user-img{
				z-index: 10;
				top:0;
				width: 400rpx;
				height: 400rpx;
				border-radius: 48rpx;
				border: 6rpx solid rgba(255,255,255,1);
				box-shadow: 0rpx 36rpx 40rpx 0rpx rgba(39,40,50,0.1);
			}
		}
		.user-imf {
			padding-top: 42rpx;
			.name{
				font-size: 52rpx;
				color: $uni-text-color;
				line-height: 74rpx;
			}
			.nick{
				font-size: $uni-font-size-base;
				line-height: 40rpx;
				color: $uni-text-color;
			}
			.intr{
				padding-top: 20rpx 100rpx;
				font-size: $uni-font-size-base;
				font-weight: 300;
				color: $uni-text-color;
				line-height: 48rpx;
			}
		}
	}
	.bottom-bar{
		.bottom-btn{
			margin: 0 $uni-spacing-col-base;
			background-color: $uni-color-primary;
		}
	}
	
	.add-misg{
		position: fixed;
		// bottom: 0;
		width: 100%;
		box-sizing: border-box;
		padding: 0 56rpx;
		// height: 1252rpx;
		background: rgba(255,255,255,1);
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		.name{
			padding-top: 168rpx 0 40rpx;
			font-size: 52rpx;
			color: $uni-text-color;
			line-height: 74rpx;
		}
		.add-main{
			padding: 18rpx 22rpx;
			box-sizing: border-box;
			width: 100%;	
			height: 420rpx;
			background:$uni-bg-color-grey;
			border-radius: $uni-border-radius-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 44rpx;
		}
	}
	.add-bt{
		bottom: -200rpx;
		z-index: 100;
		display: flex;
		.close{
			width: 172rpx;
			background: $uni-bg-color-hover;
			margin-left: $uni-spacing-col-base;
	
		}
		.send{
			margin-left:0 $uni-spacing-col-base ;
			flex: auto;
			background: $uni-color-primary;
		}
	}
	.pet{
		position: absolute;
		left:80%;
		top:30%;
		text-align: center;
		image{
			border-radius: 60rpx;
			width: 99rpx;
			height: 99rpx;
		}
	}
</style>
