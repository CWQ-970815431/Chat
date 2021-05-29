<template>
	<view class="content">
		<view class="top-bar">
			<view class="search-div">
				<image class="search-img" src="../../static/img/serch/search.png" mode=""></image>
			<input type="search"  placeholder="搜索用户名/用户群" class="search" placeholder-style="color:#aaa;font-weight:400;" @input="search"/>
			</view>
	
			<view class="top-bar-right">
				<view class="text" @tap="backOne">取消</view>
			</view>
		</view>
		<view class="main">
			<view class="search-user result">
				<view class="title" v-if="userarr.length>0">用户</view>
				<view class="list user " v-for="(item,index) in userarr":key="index">
					<navigator :url="'../userhome/userhome?id='+item._id"  hover-class="none" >
						<image :src="item.imgurl"></image>
					</navigator>
					<view class="names">
						<view class="name" v-html="item.name"></view>
						<view class="email" v-html="item.email"></view>
					</view>
					
					<view class="right-bt send" v-if="item.tip==1">	发消息</view>
					<view class="right-bt add" v-if="item.tip==0" @tap="addFriendBtn(item._id)">	加好友</view>
				</view>
			</view>
			<view class="showAll" @tap="search('all')" v-show="userarr.length == 0">
				显示所有
			</view>
		</view>
		<!-- 添加好友弹出框 -->
		<view class="modify" :style="{bottom:-+widHeight+'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="modify">取消</view>
				<view class="title">添加好友</view>
				<view class="define" @tap="addSubmit">确定</view>
			</view>
			<view class="modify-main">
				<textarea v-model="msg" class="modify-content"></textarea>
				
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
				uid:'',
				token:'',
				myname:'',
				data:'',
				msg:'',
				fid:'',
				userarr:[],
				animationData:{},			//动画
				isModfiy:false,				//动画开关
				widHeight:'',				//页面高度
			}
		},
		onLoad:function(e){
			this.getStorages()
			this.search(e.serchInput)
		},
		onReady:function(){
			this.getElementStyle()
		},
		methods:{
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
			//获取关键词 
			search:myfun.debounce(function(e){
				console.log(e)
				this.userarr = [];	//先清空用户数组
				if(e == 'all'){
					let searchval = 'all'
					if(searchval.length>0){
						this.searchUser(searchval);
					}
				}else{
					let searchval = e.detail.value;	//获取搜索框的内容
					if(searchval.length>0){
						this.searchUser(searchval);
					}
				}
				// console.log(searchval)
				
			},500),
			//寻找关键词匹配的用户
			searchUser:function(e){
				uni.request({
					url: this.serverUrl + '/search/user',		//判断是否为好友
					data: {
						data:e,
						token:this.token,
					}, 
					method: "POST",
					success: (data) => {
						// console.log(data)	
						let status = data.data.status;
						if (status == 200) {
							let arr = data.data.result;
							
							for(let i = 0; i<arr.length;i++){
								this.isFriend(arr[i],e);
								
							}
							// console.log(this.userarr)
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错了！',
								duration: 2000, //显示时间
								icon: 'none'
							})
						}else if(status == 300){
							//token过期
							uni.navigateTo({
								url:'../login/login?name='+this.myname
							})
						}
					}
				})
			},
			//判断是否为用户得好友
			isFriend:function(arr,e){
				let tip = 0 ;
				let exp = eval("/"+e+"/g");
				if(arr._id == this.uid){
					tip = 2;
					arr.tip =tip
					arr.imgurl = arr.imgurl;
					arr.name = arr.name.replace(exp,"<span style='color:#4AAAFF;'>"+e+"</span>");
					arr.email = arr.email.replace(exp,"<span style='color:#4AAAFF;'>"+e+"</span>");
					this.userarr.push(arr);
				}
				else{
					uni.request({
						url: this.serverUrl + '/search/isfriend',		//判断是否为好友
						data: {
							uid:this.uid,
							fid:arr._id,
							token:this.token,
						}, 
						method: "POST",
						success: (data) => {
							// console.log(data)	
							let status = data.data.status;
							if (status == 200) {
								//如果是好友
								tip = 1 ;
							} else if (status == 400) {
								//不是好友
								
								}
							else if (status == 500) {
								uni.showToast({
									title: '服务器出错了！',
									duration: 2000, //显示时间
									icon: 'none'
								})
							}else if(status == 300){
								console.log('300le a ')
								//token过期
								uni.navigateTo({
									url:'../login/login?name='+this.myname
								})
							}
							arr.tip =tip
							arr.imgurl = arr.imgurl;
							arr.name = arr.name.replace(exp,"<span style='color:#4AAAFF;'>"+e+"</span>");
							arr.email = arr.email.replace(exp,"<span style='color:#4AAAFF;'>"+e+"</span>");
							this.userarr.push(arr);
						}
					})
				}
				
					
			},
			//返回
			backOne:function(){
				uni.switchTab({
					url:'../chat/chat'
				})
			},
			//修改项弹框
			modify:function(){
				this.isModify = !this.isModify;
				var animation =	uni.createAnimation({
					duration:300,
					timingFunction:'ease'
				})
					
				if(this.isModify){
					animation.bottom(0).step();
				}else{
					animation.bottom(-this.widHeight).step();
				}
				this.animationData = animation.export()
			},
			//添加好友按钮
			addFriendBtn:function(fid){
				this.fid=fid;
				this.msg = this.myname + '请求添加好友~'
				this.modify();
			},
			sendSocket:function(){
						 this.socket.emit('friendrequest',this.uid,this.fid,);
			},
			//确定添加好友
			addSubmit:function(){
				if(this.msg.length>0){
					uni.request({
						url: this.serverUrl + '/friend/applyfriend',		//判断是否为好友
						data: {
							uid:this.uid,
							fid:this.fid,
							token:this.token,
							msg:this.msg,
						}, 
						method: "POST",
						success: (data) => {
							let status = data.data.status;
							if (status == 200) {
								this.sendSocket()
								uni.showToast({
									title: '发送成功！',
									duration: 2000, //显示时间
									icon: 'none'
								})
								
							} else if (status == 500) {
								uni.showToast({
									title: '服务器出错了！',
									duration: 2000, //显示时间
									icon: 'none'
								})
							}else if(status == 300){
								console.log('300le a ')
								//token过期
								uni.navigateTo({
									url:'../login/login?name='+this.myname
								})
							}
							this.modify();
						}
					})
				}
				
			},
			//获取液面高度
			getElementStyle:function(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data => {
					// console.log("得到布局位置信息"+ JSON.stringify(data));
					// console.log("节点离页面顶部得距离为"+ data.top);
					this.widHeight =data.height;
				}).exec();
			},
		}	
	}
</script>

<style lang="scss">
@import "../../common/css/mycss.scss";
.top-bar{	
	background: rgba(255,255,255,0.96);
	border-bottom: 1px solid $uni-bg-color;
	.search-div{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		// border: 1px solid red;
		z-index: -1;
		box-sizing: border-box;
		padding: 14rpx 118rpx 14rpx $uni-spacing-col-base;
	}
	.search {
		padding: 0 60rpx 0 12rpx;
		height: 60rpx;
		background:$uni-bg-color-grey;
		border-radius: 10px;
	}
	.search-img{
		position: absolute;
		right: 130rpx;
		top: 22rpx;
		width: 40rpx;
		height: 40rpx;
		
	}
}
	.main {
		padding: 88rpx $uni-spacing-col-base;
		.result {
			padding-top: $uni-spacing-col-base;
			.title{
				font-size: 44rpx;
				font-weight: 600;
				color: $uni-text-color;
				line-height: 60rpx;
			}
			.list{
				width: 100%;
				height: 80rpx;
				padding: 20rpx 0 88rpx 0;
				// border: 1px solid red;
				image{
					float: left;
					width: 80rpx;
					height: 80rpx;
					border-radius: $uni-border-radius-base;
				}
			}
			.names{
				float: left;
				padding-left: $uni-spacing-col-base;
			}
			.name{
				font-size: 36rpx;
				color: $uni-text-color;
				line-height: 50rpx;
			}
			.email{
				font-size:$uni-font-size-sm;
				color: $uni-text-color;
				line-height: 28rpx;
			}
			.right-bt{
				float: right;
				width: 120rpx;
				height: 48rpx;
				border-radius: 24rpx;
				font-size:$uni-font-size-sm;
				line-height: 48rpx;
				margin-top: 16rpx;
				text-align: center;
			}
			.send{
				background: $uni-color-primary;
					color: $uni-text-color;
			}
			.add{
				background: rgba(74,170,255,0.1);
					color: $uni-color-success;
			}
		}
	}
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
	.showAll{
		position: absolute;
		left: 36%;
		top: 39%;
		font-weight: bold;
		animation: 3s infinite;
		animation-name: bk;
		width: 200rpx;
		line-height: 100rpx;
		height: 100rpx;
		border-radius: 50rpx;
		text-align: center;
		border: 1px solid rgba(	216,191,216,0.2);
	}
	@keyframes bk{
		0%{
			background: rgba(255,215,0,0.2);
		}
		50%{
			background: rgba(255,215,0,1);
		}
		100%{
			background: rgba(255,215,0,0.2);
		}
	}
</style>
