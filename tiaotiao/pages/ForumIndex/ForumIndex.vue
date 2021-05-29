<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image class="back-img" src="../../static/back.png" mode=""></image>
			</view>
			<view class="top-bar-center title"> 标题：《{{title}}》</view>
			<view class="top-bar-right pice"></view>
		</view>
		<view class="main">

			<view class="title">
				<image :src="uimgurl" mode=""></image>
				<view class="title-middle">
					<view class="name">
						{{name}}
					</view>
					<view class="">
						{{time}}
					</view>
				</view>
				<u-button class="title-right" v-if="tip==0" @tap="addFriendSubmit" type="info">加好友</u-button>

				<u-button class="title-right" v-if="tip==1" @tap="chathim" type="primary">
					发消息</u-button>
				<u-button class="title-right len" v-else @tap="deleteForm" type="error">删除文章</u-button>

			</view>
			<image class="titleIMG" :src="Forumimage" mode=""></image>
			<view class="msg">
				{{message}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tip: 0,
				token: '',
				name: '',
				message: '',
				time: '',
				uimgurl: '',
				Forumimage: '',
				title: '',
				id: '',
				uid: '',
				text_data: '',
				ForumID: '',
			};
		},
		methods: {
			deleteForm: function() {
				uni.showModal({
					title: '提示',
					content: '确定删除问文章吗?',
					success: (res) => {
						if (res.confirm) { //点击确定
							uni.request({
								url: this.serverUrl + '/Forum/delete', //删除好友
								data: {
									forumid: this.ForumID,
									token: this.token,
								},
								method: "POST",
								success: (data) => {
									let status = data.data.status;
									if (status == 200) {
										//删除好友 跳回首页
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
											url: '../signin/signin?name=' + this.myname
										})
									}
									setTimeout(function() {
										uni.navigateBack({
											delta: 1
										})
									}, 100)
								}
							})
						} else if (res.cancel) {

						}
					}
				})
			},
			addFriendSubmit: function() {
				this.text_data = this.myname + ' 请求添加好友~~';
				if (this.text_data.length > 0) {
					uni.request({
						url: this.serverUrl + '/friend/applyfriend', //申请为好友
						data: {
							uid: this.uid,
							fid: this.id,
							msg: this.text_data,
							token: this.token,
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
							} else if (status == 300) {
								//token过期
								uni.navigateTo({
									url: '../signin/signin?name=' + this.myname
								})
							}

						}
					})
				}
			},
			backOne: function() {
				let pages = getCurrentPages(); // 获取当前页面栈层数     例如16
				let backPages = pages.length - 1; // 当前层数减一获取要跳转的页面的层数   15
				uni.navigateBack({
					delta: backPages //跳转十五层  回到第一层页面
				})

			},
			getStorage: function() {
				const value = uni.getStorageSync('user')
				if (value) {
					this.uid = value.id
					this.token = value.token
				} else {
					//如果没有数据缓存，跳转到登陆页面
					uni.redirectTo({
						url: '../login/login',
					})
				}
			},
			chathim: function() {
				uni.navigateTo({
					url: '../chatroom/chatroom?id=' + this.id + '&name=' + this.name + '&img=' + this.uimgurl
				})
			},
			isFriend: function() {
				if (this.id == this.uid) {
					this.tip = 2
				} else {
					uni.request({
						url: this.serverUrl + '/search/isfriend', //判断是否为好友
						data: {
							uid: this.uid,
							fid: this.id,
							token: this.token,
						},
						method: "POST",
						success: (data) => {
							// console.log(data)	
							let status = data.data.status;
							if (status == 200) {
								//如果是好友
								this.tip = 1
							} else if (status == 400) {
								//不是好友

							} else if (status == 500) {
								uni.showToast({
									title: '服务器出错了！',
									duration: 2000, //显示时间
									icon: 'none'
								})
							} else if (status == 300) {
								console.log('300le a ')
								//token过期
								uni.navigateTo({
									url: '../login/login?name=' + this.myname
								})
							}
						}
					})
				}

			}
		},
		onLoad(e) {
			this.getStorage()
			this.name = e.name
			this.message = e.message
			this.time = e.time
			this.uimgurl = e.uimgurl
			this.Forumimage = e.Forumimage
			this.title = e.title
			this.id = e.uid
			this.isFriend()
			this.ForumID = e.ForumID

		}
	}
</script>

<style lang="scss">
	@import "../../common/css/mycss.scss";

	page {
		height: 100%;
	}

	.content {
		height: 100vh;
		background: rgba(244, 244, 244, 0.5);
	}

	.main {
		padding-top: 118rpx;

		.title {
			display: flex;

			image {
				border-radius: 111rpx;
				width: 99rpx;
				height: 99rpx;
			}

			.title-middle {
				margin-left: 30rpx;
				margin-top: 15rpx;
			}

			.title-right {
				border-radius: 99rpx;
				height: 70rpx;
				width: 130rpx;
				text-align: center;
				line-height: 70rpx;
				margin-left: 100rpx;
				margin-top: 15rpx;
			}
			.len{
				width: 150rpx;
			}
		}

		.titleIMG {
			width: 100%;
			margin-left: 3%;
			margin-top: 5%;
			height: 500rpx;
		}

		.msg {
			margin-left: 5%;
			margin-top: 5%;
		}
	}
</style>
