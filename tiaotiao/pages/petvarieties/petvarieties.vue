<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image class="back-img" src="../../static/back.png" mode=""></image>
			</view>
			<view class="top-bar-center title">添加宠物	</view>
			
		</view>
		<view class="main-content" v-if="!varieties" >
			<view class="pet-list" v-for="(item,index) in pet[type] " @tap="choose(item.name)">

				<image :src="item.imgurl" mode=""></image>
			
				<view >
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="choose-name" v-if="varieties">
			<view class="name-title">
				宠物名&头像
			</view>
			<view class="pet-img" >
				<image-cropper :src="tempFilePath" @confirm="confirm" ></image-cropper>
				<image :src="cropFilePath" @tap="upload" class="user-img"></image>
			</view>
				<input v-model="petname" class="input-name"   placeholder="宠物名字" placeholder-style="margin-left:20rpx;font-weight:400;" type="text" value="" />

			
		</view>
		<view class="Submit" @tap="Submit">
			继续
		</view>
		</view>
</template>

<script>
	import ImageCropper from "../../components/ling-imgcropper/ling-imgcropper.vue";
	export default {
		data() {
			return {
				cropFilePath:'../../static/pet/imgh.png',
				varieties:'',
				tempFilePath:'../../static/pet/imgh.png',
				petname:'',
				type:'',
				token:'',
				pet:{
					dog:[
					{	imgurl:'../../static/pet/dog/tiao.jpg',name:'条士奇'},
					{	imgurl:'../../static/pet/dog/hashiqi.jpg',name:'哈士奇'},
					{	imgurl:'../../static/pet/dog/samoye.jpg',name:'萨摩耶'},
					{	imgurl:'../../static/pet/dog/alasijia.jpg',name:'阿拉斯加'},
					{	imgurl:'../../static/pet/dog/jinmao.jpg',name:'金毛'},
					{	imgurl:'../../static/pet/dog/labuladuo.jpg',name:'拉布拉多'},
					{	imgurl:'../../static/pet/dog/chaiquan.jpg',name:'柴犬'},
					{	imgurl:'../../static/pet/dog/bianmu.jpg',name:'边牧'},
					{	imgurl:'../../static/pet/dog/demu.jpg',name:'德国牧羊犬'},
					{	imgurl:'../../static/pet/dog/guibin.jpg',name:'贵宾犬'},
					{	imgurl:'../../static/pet/dog/xuenarui.jpg',name:'雪纳瑞'},
					{	imgurl:'../../static/pet/dog/qiutian.jpg',name:'秋田犬'},
					],
					cat:[
						{	imgurl:'../../static/pet/cat/jinjila.jpg',name:'金吉拉'},
						{	imgurl:'../../static/pet/cat/USAduanmao.jpg',name:'美国短毛猫'},
						{	imgurl:'../../static/pet/cat/jiafei.jpg',name:'加菲猫'},		
						{	imgurl:'../../static/pet/cat/bosimao.jpg',name:'波斯猫'},			
						{	imgurl:'../../static/pet/cat/sugelanzheer.jpg',name:'苏格兰折耳猫'},			
						{	imgurl:'../../static/pet/cat/hubanmao.jpg',name:'虎斑猫'},			
						{	imgurl:'../../static/pet/cat/buou.jpg',name:'布偶猫'},			
						{	imgurl:'../../static/pet/cat/mianyin.jpg',name:'缅因猫'},
						{	imgurl:'../../static/pet/cat/tianyuan.jpg',name:'中华田园猫'},
						{	imgurl:'../../static/pet/cat/aijimao.jpg',name:'埃及猫'},
						{	imgurl:'../../static/pet/cat/abixiniya.jpg',name:'阿比西尼亚猫'},
					]},
			};
		},
		components: {ImageCropper},
		onLoad(e) { 
			this.type = e.type;
			this.getStorages();
			console.log(this.type)
		},
		methods:{
			//获取缓存
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
			backOne:function(){
				        uni.navigateBack({
				             delta: 1         //跳转十五层  回到第一层页面
				        })
				
			},
			choose:function(e){
				this.varieties = e;
				console.log(this.varieties)
			},
			upload:function(){
			            uni.chooseImage({
			                count: 1, //默认9
			                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			                sourceType: ['album','camera'], //从相册选择
			                success: (res) => {
			                     this.tempFilePath = res.tempFilePaths.shift()
			                }
			            });
			        },
			confirm (e){
			             this.tempFilePath = "";
			             this.cropFilePath = e.detail.tempFilePath;
			             },
			       
			            
			         
			update:function(e,type,pwd){
				
				   uni.request({
					url: this.serverUrl + '/user/update',		
					data: {
						id:this.uid,
						data:e,
						type:type,
						pwd:pwd,
						token:this.token,
					},
					method: "POST",
					success: (data) => {
						
						let status = data.data.status;
						console.log('状态码：'+status)
						if (status == 200) {
						}else if (status == 400) {
							uni.showToast({
								title: '输入原始密码错误',
								duration: 2000, //显示时间
								icon: 'none'
							})}
							else if (status == 201) {
								uni.showToast({
									title: '已被占用',
									duration: 2000, //显示时间
									icon: 'none'
								})}
						 else if (status == 500) {
							uni.showToast({
								title: '服务器出错了！',
								duration: 2000, //显示时间
								icon: 'none'
							})
						}else if (status == 300) {
							//token过期
							uni.navigateTo({
								url:'../login/login?name='+this.myname
							})
						}
					}
				   })
			},	
			Submit:function(){
				uni.uploadFile({
				  url: this.serverUrl+'/files/upload',
				  filePath: this.cropFilePath,
				  name: "file",
				  fileType: "image",
				formData: {
					url:'user',
					name:this.uid,
					token:this.token
				 },
				  success: (uploadFileRes) => {
				    var backstr =this.serverUrl+'/'+uploadFileRes.data
						 // .replace('data/user/',"");
						 console.log(backstr)
				
						 // try{
							// uni.setStorageSync('user',{
							// 	'id':this.uid,
							// 	'name':this.name,
							// 	'petimg':backstr,
							// 	'token':this.token
							// });
						 // }catch(e){
							// //error
							// console.log('数据存储出错');
						 // }
						 //存储头像到数据库
						 this.update(backstr,'petImg',undefined)
				  }
				   });
				this.update(this.varieties,'varieties',undefined)  
				this.update(this.petname,'petName',undefined)
				uni.showToast({
								title: 'succeseful！',
								duration: 2000, //显示时间
								icon: 'none'
							})
				uni.switchTab({
					url:'../index/index'
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
		background:rgba(244,244,244,0.5) ;
	}
	.top-bar{
		
		background: rgba(244,244,244,0.96);
		border-bottom: 1px solid $uni-border-color;
		.title{
			font-size: 45rpx;
			}
	}
	.main-content{
		margin-top: 150rpx;
		margin-left: 10rpx;
		.pet-list{
			padding: 5rpx;
			text-align: center;
			display: inline-block;
			image{
				width: 170rpx;
				height: 170rpx;
			}
		}
	}
	.choose-name{
		margin-top: 200rpx;
		.name-title{
			display: block;
				margin-left: 70rpx;
				font-weight: bold;
				font-size: 55rpx;
			}
		.pet-img{
			display: inline-block;
			width: 300rpx;
			height: 300rpx;
			border-radius: 188rpx;
			background-color:rgba(0,0,205,0.6) ;
			margin-top: 130rpx;
			margin-left: 200rpx;
			text-align: center;
			image{
				display: inline-block;
				width: 100rpx;
				height: 100rpx;
				margin-top: 100rpx;
			}
		}
		.input-name{
			margin-top: 55rpx;
			margin-left: 40rpx;
			padding-left: 25rpx;
			width: 86%;
			height: 120rpx;
			background-color:rgba(112,128,144,0.2);
			border-radius: 10rpx;
		}
			
	}
	.Submit{
		margin-top: 250rpx;
		margin-left: 30rpx;
		width: 90%;
		height: 120rpx;
		text-align: center;
		border-radius: 30rpx;
		background-color: rgba(255,99,71,1);
		line-height: 120rpx;
		color: #FFFFFF;
		}

</style>
