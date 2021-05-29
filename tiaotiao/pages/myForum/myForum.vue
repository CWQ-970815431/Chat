<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image class="back-img" src="../../static/back.png" mode=""></image>
			</view>
			<view class="top-bar-center title">	我的发布	</view>
		</view>
		<view class="main-content">
			<view class="luntan-list" v-if="List.length>0">
				<view class="luntan-list-item" v-for="(item,index) in List" :key="index" >
					<view class="item-top">
						<image :src="item.uimgurl" mode=""></image>
						<view class="item-title" @click="readItem(item)">
							{{item.name}}
							<view class="item-title-botoom">
								{{item.title}}
							</view>
						</view>
						<view class="add-btn" @tap="deleteForm(item)" >
							删除
						</view>
					</view>
			
					<view class="item-main">
						<view class="item-msg" @click="readItem(item)">
							{{item.message}}
						</view>
						<view class="item-img">
							<image :src="item.Forumimage" mode=""></image>
			
						</view>
						<view class="item-heat">
							<view class="heat-point">
								<view class="">
									日常吸狗
									<image class="start" src="../../static/index/hot.png" mode=""></image>
								</view>
			
							</view>
							<!-- <image src="../../static/index/liuyan.png" mode=""></image> -->
							<view class="count">
								{{item.time}}
							</view>
							<!-- <image src="../../static/index/like.png" mode=""></image>
							<view class="count">
								{{item.comment.length}}
							</view> -->
						</view>
					</view>
				</view>
			</view>
			<view class="none" v-else>
				<view class="">
					暂时没有发布过消息
				</view>
			<u-button type="warning" @tap="torelase" :ripple="true">去发布</u-button></view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				List:[],
				token:''
			};
		},
		onLoad(e){
			
			const value = uni.getStorageSync('user');
			if (value) {
				this.token = value.token;
				this.id =value.id
				}
			this.getList()
		},
		onPullDownRefresh() {
					 this.List=[]
				const value = uni.getStorageSync('user');
				if (value) {
					this.token = value.token;
					this.id =value.id
					}
				this.getList()
		       setTimeout(function () {
		           uni.stopPullDownRefresh();
		       }, 1000);
		   },	
		
		methods:{
			readItem: function(e) {
				uni.navigateTo({
					url: '../ForumIndex/ForumIndex?name=' + e.name + '&message=' + e.message + '&time=' + e.time + '&uimgurl=' + e.uimgurl +
						'&Forumimage=' + e.Forumimage+'&title=' + e.title + '&uid='+e.uid +'&ForumID='+e.ForumID
				})
			},
			torelase: function() {
				uni.navigateTo({
					url: "../release/release?id=" + this.id
				})
				this.show = false
			},
			deleteForm: function(item) {
				uni.showModal({
					title: '提示',
					content: '确定删除问文章吗?',
					success: (res) => {
						if (res.confirm) { //点击确定
							uni.request({
								url: this.serverUrl + '/Forum/delete', //删除好友
								data: {
									forumid: item.ForumID,
									token: this.token,
								},
								method: "POST",
								success: (data) => {
									let status = data.data.status;
									if (status == 200) {
										uni.showToast({
											title: '删除文章成功！',
											duration: 2000, //显示时间
											icon: 'none'
										})
			
									} else if (status == 500) {
										uni.showToast({
											title: '服务器出错了！',
											duration: 2000, //显示时间
											icon: 'none'
										})
									} else if (status == 300) {
										//token过期
										uni.navigateTo({
											url: '../signin/signin' 
										})
									}
									setTimeout(function() {
										uni.redirectTo({
										    url: '../myForum/myForum'
										});
									}, 100)
								}
							})
						} else if (res.cancel) {
			
						}
					}
				})
			},
			getList: function() {
				uni.request({
					url: this.serverUrl + '/Forum/get',
					data: {
						token: this.token,
						uid:this.id
					},
					method: "POST",
					success: (data) => {
						let status = data.data.status;
						if (status == 200) {
							this.List = data.data.result;
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错了！',
								duration: 2000, //显示时间
								icon: 'none'
							})
						} else if (status == 300) {
							//token过期
							uni.navigateTo({
								url: '../signin/signin?name=' + this.myname
							})
						}
					}
				})
			},
			backOne:function(){
				let pages = getCurrentPages();  // 获取当前页面栈层数     例如16
				    let backPages = pages.length - 1;  // 当前层数减一获取要跳转的页面的层数   15
				        uni.navigateBack({
				             delta: backPages         //跳转十五层  回到第一层页面
				        })
				
			},
		}
	}
</script>

<style lang="scss">
	@import "../../common/css/mycss.scss";
	page{
		height: 100%;
	}
	.main-content{
		margin-top: 120rpx;
	}
	.luntan-list {
		margin-bottom: 50mrpx;
		.luntan-list-item {
			.item-top {
				display: flex;
				margin-left: 20rpx;
	
				image {
					border-radius: 50px;
					width: 99rpx;
					height: 99rpx;
				}
	
				.item-title {
					padding: 20rpx;
					flex: 1;
	
					.item-title-botoom {
						color: #C0C0C0;
						font-size: 12rpx;
					}
				}
	
				.add-btn {
					margin-right: 20rpx;
					margin-top: 30rpx;
					color: blue;
					text-align: center;
					width: 120rpx;
					line-height: 50rpx;
					height: 50rpx;
					border-radius: 30rpx;
					border: 2px solid blue;
				}
			}
	
			.item-main {
				padding-bottom: 30rpx;
				border-bottom: 1rpx solid #808080;
	
				.item-msg {
					padding-left: 20rpx;
					width: 95%;
					font-size: 30rpx;
					max-height: 83rpx;
					overflow: hidden;
					white-space: pre-line;
					text-overflow: ellipsis
				}
	
				.item-img {
					image {
						padding: 10rpx;
						width: 230rpx;
						height: 230rpx;
					}
	
				}
	
				.item-heat {
					display: flex;
	
					.heat-point {
						flex: 1;
						display: flex;
	
						view:nth-of-type(1) {
							font-size: 28rpx;
							padding-left: 25rpx;
							color: rgba(70, 130, 180, 1);
							max-width: 210rpx;
							background-color: rgba(211, 211, 211, 0.3);
							border-radius: 20rpx;
							border: 1px solid #999999;
						}
	
						.start {}
					}
	
					image {
						padding-right: 5rpx;
						width: 50rpx;
						height: 50rpx;
					}
	
					.count {
						padding: 10rpx;
					}
				}
			}
		}
	}
	.none{
		    text-align: center;
		    margin: 70% auto;
		    width: 40%;
			view{
				margin-bottom: 30rpx;
			}
			
	}
	.title{
		font-size: 45rpx;
	}
</style>
