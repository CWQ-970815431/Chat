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
			<view class="top-bar-search">
				<image  src="../../static/index/search.png" mode=""></image>
				<input class="search" type="text" value="" placeholder="搜索" />
			</view>
		</view>
		<view class="main-content">
			<view class="swiper">
			    <swiper :autoplay="true" :interval="5000" :duration="2500" :indicator-dots="true"
			    >
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
				<view class="luntan-list-item">
					<view class="item-top">
						<image src="../../static/img/one.jpg" mode=""></image>
						<view class="item-title">
							tiaotiao
							<view class="item-title-botoom">
								小作家
							</view>
						</view>
						<view class="add-btn">
							关注	
						</view>
					</view>
					
					<view class="item-main">
						<view class="item-msg">
							逮到一条乱晃的条尾巴!12312321321321321213123123123123212112312312323
						</view>
						<view class="item-img">
							<image src="../../static/pet/dog/alasijia.jpg" mode=""></image>
							<image src="../../static/pet/dog/alasijia.jpg" mode=""></image>
							<image src="../../static/pet/dog/alasijia.jpg" mode=""></image>
						</view>
						<view class="item-heat">
							<view class="heat-point">
								<view class="">
									日常吸狗
									<image class="start" src="../../static/index/hot.png" mode=""></image>
								</view>
								
							</view>
							<image src="../../static/index/liuyan.png" mode=""></image>
							<view class="count">
								0
							</view>
							<image src="../../static/index/like.png" mode=""></image>
							<view class="count">
								2
							</view>
						</view>
					</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				uid:'',			//用户id
				imgurl:'', 		//用户头像
				token:'',		//token
				navlist:[{name:'推荐',show:1},{name:'关注',show:0},
				{name:'最新',show:0},{name:'视频',show:0},{name:'本地',show:0}],
				topSwiper: [
					{src: require('../../static/index/lunbo/one.jpg')},
					{src: require('../../static/index/lunbo/two.jpg')},
					{src: require('../../static/index/lunbo/three.jpg')},
					{src: require('../../static/index/lunbo/one.jpg')},
					{src: require('../../static/index/lunbo/two.jpg')}
				],
				 btnlist:[
					 {name:'签到',imgurl:'../../static/index/sign.png'},
					 {name:'问答',imgurl:'../../static/index/ask.png'},
					 {name:'测评',imgurl:'../../static/index/test.png'},
					 {name:'话题',imgurl:'../../static/index/huati.png'},
					 {name:'达人',imgurl:'../../static/index/daren.png'},
				 ]
			}
				
		},
		onLoad(options) {
			console.log('load.....')
			this.getStorage();
		        },
	
		methods: {
			getStorage:function(){
				const value = uni.getStorageSync('user')
				if(value){
						 this.imgurl = value.imgurl
						 this.uid = value.id
						 this.token = value.token
						 this.myname = value.name;
				}
				else{
					//如果没有数据缓存，跳转到登陆页面
					uni.redirectTo({
						url:'../login/login',
					})
				}
			},
			click:function(e){
				let len = this.navlist.length;
				for(let i =0;i<len;i++){
					this.navlist[i].show = 0
				}
				this.navlist[e].show = 1
			}
			
		},
		computed:{
			
			    },	
		}
	
</script>

<style lang="scss">

	.content{
		width: 100vw;
		height: 100vh;
	}
	.top-bar{
		z-index: 50;
		position: fixed;
		background: #FFFFFF;
		top: 0;
		width: 100%;
	}
	.top-bar-list{
		margin-left: 20rpx;
		display: flex;
		.btn-bar{
			flex: 1;
			width: 100rpx;
			font-size: 35rpx;
			padding: 15rpx;
			image{
				padding-left: 25rpx;
				width: 55rpx;
				height: 55rpx;
			}
		}
		.btn-show{
			flex: 1;
			font-size: 45rpx;
			padding: 12rpx;
			border-bottom:1px solid #ccc;
		}
		.btn-show:after{
			width: 10rpx;
			height: 10rpx;
			color: #333333;
			background: #333333;
		}
	
	}
	.top-bar-search{
		position: relative;
		image{
			width: 55rpx;
			height: 55rpx;
			position: absolute;
			margin-top: 10rpx;
			margin-left: 20rpx;
		}
		.search{
			width: 83%;
			height: 80rpx;
			margin-left: 10rpx;
			padding-left: 76rpx;
			border-radius: 50rpx;
			background-color:rgba(	216,191,216,0.3);
		}
	}
	.main-content{
		margin-top: 200rpx;
	}
	swiper{
	    width: 100%;
	    height: 290rpx;
	    
	    swiper-item{
	
	        image {
	            width: 100%;
	            height: 290rpx;
	            display: block;
	        }
	    }
	}
	.content-list{
		margin-top: 20rpx;
		display: flex;
		border-bottom:1px solid #ccc;
		.conten-list-item{
			text-align: center;
			padding:20rpx;
			.item-btn{
				width: 113rpx;
				height: 113rpx;
				border-radius: 55rpx;
				image{
					margin-top: 10rpx;
					width: 88rpx;
					height: 88rpx;
				}
			}
			.item-title{
				margin-top: 10rpx;
			}
		}
		.conten-list-item:nth-of-type(1){
			.item-btn{
				background: rgba(	148,0,211,0.7);
				}
		}
		.conten-list-item:nth-of-type(2){
			.item-btn{
				background: rgba(	255,215,0,0.7);
				}
		}
		.conten-list-item:nth-of-type(3){
			.item-btn{
				background: rgba(135,206,235,0.7);
				}
		}
		.conten-list-item:nth-of-type(4){
			.item-btn{
				background: rgba(255,69,0,0.7);
				}
		}
		.conten-list-item:nth-of-type(5){
			.item-btn{
				background: rgba(127,255,170,0.7);
				}
		}
	}
	.luntan-list{
		.luntan-list-item{
			.item-top{
				display: flex;
				margin-left: 20rpx;
				image{
					border-radius: 50px;
					width: 99rpx;
					height: 99rpx;
				}
				.item-title{
					padding: 20rpx;
					flex: 1;
					.item-title-botoom{
						color: #C0C0C0;
						font-size: 12rpx;
					}
					}
				.add-btn{
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
			.item-main{
				padding-bottom: 30rpx;
				border-bottom: 1rpx solid #808080;
				.item-msg{
					padding-left: 20rpx;
					width: 95%;
					font-size: 30rpx;
					max-height: 83rpx;
					overflow: hidden;
					white-space:pre-line;
					text-overflow:ellipsis
				}
				.item-img{
					image{	
						padding: 10rpx;
					width: 230rpx;
					height: 230rpx;
					}
					
				}
				.item-heat{
					display: flex;
				
					.heat-point{
						flex:1;
						display: flex;
						view:nth-of-type(1){
							font-size: 28rpx;
							padding-left: 25rpx;
							color:rgba(70,130,180,1);
							max-width: 210rpx;
							background-color: rgba(	211,211,211,0.3);
							border-radius: 20rpx;
							border: 1px solid #999999;
						}
						.start{
							
						}
						}
					image{
						padding-right: 5rpx;
						width: 50rpx;
						height: 50rpx;
					}
					.count{
						padding: 10rpx;
					}
				}
				}
		}
	}
</style>
