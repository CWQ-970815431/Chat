<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				
				<image class="back-img" src="../../static/back.png" mode=""></image>
			</view>
			<view class="top-bar-center title">添加宠物	</view>
			<view class="top-bar-right pice" @tap="toNextPage">
				暂时跳过
			</view>
		</view>
		<view class="choose">
			<view class="pet-c" v-for="(item,index) in pet" :key="item+index">
				<navigator :url="'../petvarieties/petvarieties?type='+item.type"  hover-class="none" >
				<image  :src="item.imgurl" mode=""></image>
				</navigator>
				<view class="">
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="title-b">
			添加宠物后您会获取更精准的服务噢
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pet:[{
					name:'汪汪',
					imgurl:'../../static/pet/dog.png',
					type:'dog',
				},{
					name:'喵喵',
					imgurl:'../../static/pet/cat.png',
					type:'cat',
				},{
					name:'小宠',
					imgurl:'../../static/pet/anthoer.png',
					type:'another',
				},{
					name:'水族',
					imgurl:'../../static/pet/fish.png',
					type:'water',
				},{
					name:'爬虫',
					imgurl:'../../static/pet/insect.png',
					type:'reptile'
				},
					
				]
			};
		},
		methods:{
			backOne:function(){
				let pages = getCurrentPages();  // 获取当前页面栈层数     例如16
				    let backPages = pages.length - 1;  // 当前层数减一获取要跳转的页面的层数   15
				        uni.navigateBack({
				             delta: backPages         //跳转十五层  回到第一层页面
				        })
				
			},
			toNextPage:function(){
				uni.switchTab({
					url:'/pages/index/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../../common/css/mycss.scss";
	page{
		height: 100%;
	}
	.content{
		
		height: 100%;
		background:rgba(244,244,244,1) ;
	}
	.top-bar{
		
		background: rgba(244,244,244,0.96);
		border-bottom: 1px solid $uni-border-color;
		.title{
			font-size: 45rpx;
			}
	}
	.choose{
		color: #778899;
		margin-top: 80rpx;	
		.pet-c{
			padding: 70rpx;
			display: inline-block;
			text-align: center;
			image{	
			width: 200rpx;
			height: 200rpx;
			}
		}
	}
	.title-b{
		text-align: center;
		color: rgba(112,128,144,0.4);
	}
	.top-bar-right{
		margin-top: 20rpx;
		color: rgba(112,128,144,0.6);
		animation: 3s infinite;
		animation-name: chagneColor;
	}
	@keyframes chagneColor
	{
	0%{
		color: rgba(112,128,144,1);
	}
	50%{
		color: rgba(112,128,144,0.3);
	}
	100%{
		color: rgba(112,128,144,1);
	}
	}
	
</style>
