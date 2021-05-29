<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-list">
				<view :class="item.show ==0 ?	'btn-bar' : 'btn-show' " v-for="(item,index) in navlist" :key="index" @tap="click(index)">
					{{item.name}}
				</view>
				
				<view class="btn-bar">
					<image src="../../static/index/mannager.png" mode=""></image>
				</view>

			</view>
			<!-- <view class="top-bar-search">
				<image src="../../static/index/search.png" mode=""></image>
				<input class="search" type="text" value="" placeholder="搜索" />
			</view> -->
		</view>
		<view class="main-content">
			<view class="swiper">
				<swiper :autoplay="true" :interval="5000" :duration="2500" :indicator-dots="true">
					<swiper-item v-for="(item,index) in topSwiper" :key="index">
						<view class="swiper-item">
							<image :src="item.src" mode="aspectFill"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<view class="content-list">
				<view class="conten-list-item" v-for="(item,index) in btnlist" :key="item+index">
					<view class="item-btn">
						<image :src="item.imgurl" mode=""></image>
					</view>
					<view class="item-title">
						{{item.name}}
					</view>
				</view>
			</view>
			<view class="luntan-list">
				<view class="luntan-list-item" v-for="(item,index) in List" :key="index" >
					<view class="item-top">
						<image :src="item.uimgurl" mode=""></image>
						<view class="item-title" @click="readItem(item)">
							{{item.name}}
							<view class="item-title-botoom">
								{{item.title}}
							</view>
						</view>
						<view class="add-btn" @tap="starIt(item,1,index)" v-if="item.state == 0 ">
							收藏
						</view>
						<view class="add-btn" @tap="starIt(item,0,index)" v-if="item.state == 1 ">
							取消收藏
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

		</view>
		<image class="release" src="../../static/index/发布.png" v-if="!show" @click="show = true" mode=""></image>
		<view class="showPet" v-if="show">
			<view>
				晒晒你的宠物
			</view>
			<image src="../../static/index/showPet.png" mode=""></image>

			<image src="../../static/index/发布文章.png" @tap="torelase" mode=""></image>
			<image src="../../static/index/关闭.png" @click="show = false" mode=""></image>
		</view>

	</view>
</template>

<script>
	export default {
		
		data() {
			return {
				refresh:true, //下拉刷新
				List: [],
				uid: '',
				token: '',
				show: false,
				navlist: [{
						name: '推荐',
						show: 1
					}, {
						name: '关注',
						show: 0
					},
					{
						name: '最新',
						show: 0
					}, {
						name: '视频',
						show: 0
					}, {
						name: '本地',
						show: 0
					}
				],
				topSwiper: [{
						src: require('../../static/index/lunbo/one.jpg')
					},
					{
						src: require('../../static/index/lunbo/two.jpg')
					},
					{
						src: require('../../static/index/lunbo/three.jpg')
					},
					{
						src: require('../../static/index/lunbo/one.jpg')
					},
					{
						src: require('../../static/index/lunbo/two.jpg')
					}
				],
				btnlist: [{
						name: "Let's",
						imgurl: '../../static/index/sign.png'
					},
					{
						name: 'do',
						imgurl: '../../static/index/ask.png'
					},
					{
						name: 'it',
						imgurl: '../../static/index/test.png'
					},
					{
						name: 'together',
						imgurl: '../../static/index/huati.png'
					},
					{
						name: '!!!!',
						imgurl: '../../static/index/daren.png'
					},
				]
			}

		},
		onLoad(options) {
			console.log('load.....')
			this.getStorage();
			this.getList()
		},
		onPullDownRefresh() {
					 this.List=[]
				this.getStorage();
				this.getList()
		       setTimeout(function () {
		           uni.stopPullDownRefresh();
		       }, 1000);
		   },	

		methods: {
			isStar:function(arr,index){
				uni.request({
					url: this.serverUrl + '/Forum/isStar',
					data: {
						token: this.token,
						ForumID:arr[index].ForumID,
						userID:arr[index].uid,
					},
					method: "POST",
					success: (data) => {
						let status = data.data.status;
						if (status == 200) {
							arr[index].state =1
							this.List.splice(index,1,arr[index])
				
						} else if (status == 500 || status ==  400) {
							arr[index].state =0
							this.List.splice(index,1,arr[index])
						} 
					}
				})
			},
			starIt:function(e,s,t){
				uni.request({
					url: this.serverUrl + '/Forum/star',
					data: {
						token: this.token,
						ForumID:e.ForumID,
						userID:this.uid,
						state:s,
						 name:e.name,
						  uimgurl:e.uimgurl,
						  message: e.message, //内容
						  title:e.title,//标题
						  Forumimage: e.Forumimage, //图片
						  time: e.time ,//生成时间
					},
					method: "POST",
					success: (data) => {
						let status = data.data.status;
						if (status == 200) {
							if(data.data.statechangeto == 1){
								uni.showToast({
									title: '收藏成功！',
									duration: 2000, //显示时间
									icon: 'none'
								})
								let arr =this.List[t]
								arr.state = 1
								this.List.splice(t,1,arr)
												
								
							}else{
								uni.showToast({
									title: '取消收藏成功！',
									duration: 2000, //显示时间
									icon: 'none'
								})
								let arr =this.List[t]
								arr.state = 0
									this.List.splice(t,1,arr)
							}
							
				
						} else if (status == 500 ) {
							uni.showToast({
								title: '您已经收藏过了！',
								duration: 2000, //显示时间
								icon: 'none'
							})
						} 
					}
				})
			},
			readItem: function(e) {
				uni.navigateTo({
					url: '../ForumIndex/ForumIndex?name=' + e.name + '&message=' + e.message + '&time=' + e.time + '&uimgurl=' + e.uimgurl +
						'&Forumimage=' + e.Forumimage+'&title=' + e.title + '&uid='+e.uid +'&ForumID='+e.ForumID
				})
			},
			//获取列表
			getList: function() {
				uni.request({
					url: this.serverUrl + '/Forum/get',
					data: {
						token: this.token,
					},
					method: "POST",
					success: (data) => {
						let status = data.data.status;
						if (status == 200) {
							this.List = data.data.result;
							for(let i = 0; i<this.List.length;i++){
								this.isStar(this.List,i)
							}
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
			click: function(e) {
				let len = this.navlist.length;
				for (let i = 0; i < len; i++) {
					this.navlist[i].show = 0
				}
				this.navlist[e].show = 1
			},
			torelase: function() {
				uni.navigateTo({
					url: "../release/release?id=" + this.uid
				})
				this.show = false
			},
			

		},
		computed: {

		},
	}
</script>

<style lang="scss">
	.content {
		width: 100vw;
		height: 100%;
	}

	.top-bar {
		z-index: 50;
		position: fixed;
		background: #FFFFFF;
		top: 0;
		width: 100%;
	}

	.top-bar-list {
		margin-left: 20rpx;
		display: flex;

		.btn-bar {
			flex: 1;
			width: 100rpx;
			font-size: 35rpx;
			padding: 15rpx;

			image {
				padding-left: 25rpx;
				width: 55rpx;
				height: 55rpx;
			}
		}

		.btn-show {
			flex: 1;
			font-size: 45rpx;
			padding: 12rpx;
			border-bottom: 1px solid #ccc;
		}

		.btn-show:after {
			width: 10rpx;
			height: 10rpx;
			color: #333333;
			background: #333333;
		}

	}

	.top-bar-search {
		position: relative;

		image {
			width: 55rpx;
			height: 55rpx;
			position: absolute;
			margin-top: 10rpx;
			margin-left: 20rpx;
		}

		.search {
			width: 83%;
			height: 80rpx;
			margin-left: 10rpx;
			padding-left: 76rpx;
			border-radius: 50rpx;
			background-color: rgba(216, 191, 216, 0.3);
		}
	}

	.main-content {
		margin-top: 100rpx;
	}

	swiper {
		width: 100%;
		height: 290rpx;

		swiper-item {

			image {
				width: 100%;
				height: 290rpx;
				display: block;
			}
		}
	}

	.content-list {
		margin-top: 20rpx;
		display: flex;
		border-bottom: 1px solid #ccc;

		.conten-list-item {
			text-align: center;
			padding: 20rpx;

			.item-btn {
				width: 113rpx;
				height: 113rpx;
				border-radius: 55rpx;

				image {
					margin-top: 10rpx;
					width: 88rpx;
					height: 88rpx;
				}
			}

			.item-title {
				margin-top: 10rpx;
			}
		}

		.conten-list-item:nth-of-type(1) {
			.item-btn {
				background: rgba(148, 0, 211, 0.7);
			}
		}

		.conten-list-item:nth-of-type(2) {
			.item-btn {
				background: rgba(255, 215, 0, 0.7);
			}
		}

		.conten-list-item:nth-of-type(3) {
			.item-btn {
				background: rgba(135, 206, 235, 0.7);
			}
		}

		.conten-list-item:nth-of-type(4) {
			.item-btn {
				background: rgba(255, 69, 0, 0.7);
			}
		}

		.conten-list-item:nth-of-type(5) {
			.item-btn {
				background: rgba(127, 255, 170, 0.7);
			}
		}
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
					color: red;
					text-align: center;
					width: 120rpx;
					line-height: 50rpx;
					height: 50rpx;
					border-radius: 30rpx;
					border: 2px solid red;
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

	.release {
		position: fixed;
		left: 45%;
		bottom: 100rpx;
		width: 100rpx;
		height: 100rpx;
		opacity: 0.6;
	}

	.showPet {
		text-align: center;
		position: fixed;
		top: 0;
		z-index: 9999;
		width: 100%;
		height: 100%;
		background: white;
		font-size: 39rpx;

		view:nth-of-type(1) {
			display: inline-block;
			font-size: 35rpx;
			margin-left: 70rpx;

		}

		image:nth-of-type(1) {
			width: 350rpx;
			height: 250rpx;
			display: inline-block;
			margin: 0rpx 0 0 70rpx;
			position: relative;
			top: 110rpx;
		}

		image:nth-of-type(3) {
			width: 70rpx;
			height: 70rpx;
			position: fixed;
			bottom: 50rpx;
			left: 45%;

		}

		image:nth-of-type(2) {
			width: 270rpx;
			height: 370rpx;
			margin: 120px;

		}

		view:nth-of-type(2) {
			margin: 50% 0 0 33%;

			width: 270rpx;
			height: 270rpx;
			border: 1px solid #778899;
			border-radius: 11111rpx;
			position: relative;

			image {
				position: absolute;
				top: 40rpx;
				left: -30rpx;
				width: 200rpx;
				height: 200rpx;
				padding: -20rpx;
			}
		}

	}
</style>
