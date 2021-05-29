<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image class="back-img" src="../../static/index/关闭.png" mode=""></image>
			</view>
			<view class="top-bar-right submit" @tap="submit">
				发布
			</view>
		</view>
		<view class="main">
			<view class="chooseImage">
				<image-cropper :src="tempFilePath" @confirm="confirm"></image-cropper>
				<image v-if="cropFilePath.length>0" :src="cropFilePath" class="user-img"></image>
				<view class="" v-else @tap="upload">
					+添加封面
				</view>
			</view>
			<u-form :model="form" ref="uForm">
				<u-form-item label="标题" prop="title">
					<u-input placeholder="标题" v-model="form.title" />
				</u-form-item>
				<u-form-item label="内容" prop="message">
					<u-input placeholder="请输入您的此时的心情(●'◡'●)" maxlength="200" v-model="form.message" :type="type" :border="border" :height="height" :auto-height="autoHeight" />
				</u-form-item>
			</u-form>
		</view>


	</view>
</template>

<script>
	import ImageCropper from "../../components/ling-imgcropper/ling-imgcropper.vue";
	export default {
		components: {
			ImageCropper
		},
		data() {
			return {
				uname:'',
				uimgurl:'',
				uid:'',
				token:'',
				type: 'textarea',
				border: true,
				height: 700,
				autoHeight: true,
				cropFilePath: '',
				tempFilePath: '../../static/pet/imgh.png',
				form: {
					title: '',
					message: '',
				},
				rules: {
					title: [{
							required: true,
							message: '请输入标题',
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change', 'blur'],
						},
						{
							max: 20,
							message: '标题不能多于20个字',
							trigger: 'change'
						},
					],
					message: [{
						min: 5,
						message: '简介不能少于5个字',
						trigger: 'change'
					}, 
					{
						required: true,
						message: '请输入内容',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}, ]
				}
			};
		},
		onLoad(e){
			this.uid = e.id
			const value = uni.getStorageSync('user')
			if (value) {
				this.token = value.token
				this.uimgurl =value.imgurl
				this.uname = value.name
			} else {
				//如果没有数据缓存，跳转到登陆页面
				uni.redirectTo({
					url: '../login/login',
				})
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
						this.Submit()
					} else {
						console.log('验证失败');
					}
				});
			},
			backOne: function() {
				uni.switchTab({
					url:'../index/index'
				})

			},
			upload: function() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						this.tempFilePath = res.tempFilePaths.shift()
					}
				});
			},
			confirm(e) {
				this.tempFilePath = "";
				this.cropFilePath = e.detail.tempFilePath;
			},
			
			Submit: function() {
				if(this.cropFilePath !=''){
					uni.uploadFile({
						url: this.serverUrl + '/files/upload',
						filePath: this.cropFilePath,
						name: "file",
						fileType: "image",
						formData: {
							url: 'user',
							name: this.uid,
							token: this.token
						},
						success: (uploadFileRes) => {
							var backstr = this.serverUrl + '/' + uploadFileRes.data
							// .replace('data/user/',"");
							console.log(backstr)
							//存储头像到数据库
							uni.request({
								url:this.serverUrl+"/Forum/build",
								data:{
									uid: this.uid,
									message: this.form.message,
									image: this.backstr,
									token:this.token,
									title:this.form.title,
									uname:this.uname,
									uimgurl:this.uimgurl,
									Forumimage:backstr
								},
								method:'POST',
								success:(data) =>{
									console.log(data);
									let status = data.data.status;
									//访问后端成功
									if(status == 200){
										uni.showToast({
											title: 'succeseful！',							
											duration: 2000, //显示时间								
											icon: 'none'
										
										})
										setTimeout(function(){
											let pages = getCurrentPages();  // 获取当前页面栈层数     例如16
											    let backPages = pages.length - 1;  // 当前层数减一获取要跳转的页面的层数   15
											        uni.navigateBack({
											             delta: backPages         //跳转十五层  回到第一层页面
											        })
										},2000)
										
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
					});
				}else{
					uni.showToast({
						title:'请选择您的封面图片',
						duration:2000,
						icon:'none',
					});	
				}
					
					
					
				
			}
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

	.chooseImage {
		margin-left: 10%;
		width: 80%;
		color: rgba(112, 128, 144, 0.5);
		height: 250rpx;
		text-align: center;
		line-height: 250rpx;
		border: 1px dashed rgba(112, 128, 144, 0.5);

		.user-img {
			width: 100%;
			height: 250rpx;
		}
	}

	.main {
		margin-top: 120rpx;
	}

	.submit {
		margin-top: 20rpx;
		margin-right: 15rpx;
		color: white;
		background: rgba(255, 69, 0, 0.3);
		border-radius: 99rpx;
		height: 60rpx;
		width: 100rpx;
		text-align: center;
		line-height: 60rpx;
	}
</style>
