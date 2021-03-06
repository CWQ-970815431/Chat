<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-center">通讯录</view>
			<image class="addf" src="../../static/friend/addf.png" mode=""></image>
		</view>
		<view class="main-search">
			<image class="logo" src="../../static/main/search.svg" mode=""></image>
			<input class="main-input" type="text" value="" placeholder="搜索" @tap="toSearch"/>
		</view>
		<u-index-list :scrollTop="scrollTop" :index-list="indexList">
				<view v-for="(item, index) in indexList" :key="index">
					<u-index-anchor :index="item" />
					<view class="list-cell" v-if="e.first == item" v-for="(e,index) in friends" :key="index+e" >
						<navigator :url="'../userhome/userhome?id='+e.id"  hover-class="none" >
							<image :src="e.imgurl" mode=""></image>
						</navigator>
						
						<view v-if="!e.markname">{{e.name}}</view> 
						<view v-if="e.markname">{{e.markname}}</view> 
					</view>
					
				</view>
			</u-index-list>
	</view>
</template>

<script>
	import pinyin from 'js-pinyin'
	export default {
		
		data() {
			return {
				scrollTop: 0,
				indexList: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
				 "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U","V", "W", "X", "Y", "Z","#"],
				 uid:'',
				 imgurl:'',
				 token:'',
				 friends:[],
				 
			};
		},
		onLoad(e) {
			this.getStorages();
			this.getFriends();
		},
		
		onPageScroll(e) {
					this.scrollTop = e.scrollTop;
				},
		 methods:{
			 getStorages:function(){
			 	try {
			 		
			 	    const value = uni.getStorageSync('user');
			 	    if (value) {
			 			//数据缓存存在
			 	        // console.log(value);
			 			this.uid =value.id;
			 			this.imgurl = value.imgurl;
			 			this.token = value.token;
			 			
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
			 getFriends:function(){
			 	uni.request({
			 		url: this.serverUrl + '/index/getfriend',		
			 		data: {
			 			uid:this.uid,
			 			state:0,
			 			token:this.token,
			 		},
			 		method: "POST",
			 		success: (data) => {
			 			
			 			let status = data.data.status;
			 			if (status == 200) { 
			 				let res = data.data.result; 
			 				
			 				//群列表
			 				// this.getGroup();
			 		//拼音分析出首个字母
			 		 pinyin.setOptions({checkPolyphone: false, charCase: 0});
							var len =res.length
							for(let i =0 ; i < len;i++){
											
								if(res[i].markname){
								let fristName = pinyin.getCamelChars(res[i].markname).substring(0, 1); 
								res[i].first =  fristName
								}else{
									let fristName = pinyin.getCamelChars(res[i].name).substring(0, 1);
											res[i].first =  fristName
								}
								var p = /[a-z]/i; 
								var b = p.test(res[i].first);
								if(!b){
									res[i].first ='#'
								}
							}
							//隐藏没有对应的数据列表
							this.friends = res
							this.indexList = this.indexList.filter(function(x){
								for(var i =0;i< res.length+1;i++){
									return x ==  res[i].first
								}
							})
							this.indexList.push('#')
							console.log(this.indexList)
					
			 				// 城市列表

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
		 }		
	}
</script>

<style lang="scss">
	.top-bar{
		width: 100%;
		display: flex;
		.top-bar-center{
			margin-left: 50rpx;
			padding: 20rpx;
			font-size: 39rpx;
			flex: 1;
			text-align: center;
		}
		.addf{
			padding: 10rpx;
			width: 66rpx;
			height: 66rpx;
		}
	}
	.main-search{
		padding-top:20rpx;
		image{
			position: absolute;
			z-index: 2;
			top:10rpx
		}
		.main-input{
			width: 600rpx;
			height: 70rpx;
			margin-left: 30rpx;
			background-color:#ebebec!important;
			border-radius: 35rpx;
			padding-left: 80rpx;
		}
		.logo{
			width:70rpx;
			height: 100rpx;
			box-sizing: border-box;
			padding: 10rpx;
			margin-left: 40rpx;
			margin-top: 85rpx;
		}
	}
	.list-cell{
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		padding: 5rpx;
		display: flex;
		image{
			padding: 10rpx;
			width: 76rpx;
			height: 76rpx;
		}
	}
</style>
