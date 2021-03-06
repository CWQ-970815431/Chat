<template>
	<view class="content">
		<view class="top-bar"  >
		
				
			<image  v-if="id != uid" class="pet-img" :src="cropFilePath" ></image>
			<image-cropper v-if="id == uid" :src="tempFilePath" @confirm="confirm"  @cancel="cancel"></image-cropper>				
			<image  v-if="id == uid" class="pet-img" :src="cropFilePath" @tap="upload"></image>
			<view class="top-bar-left" @tap="backOne">
				<image class="back-img" src="../../static/back.png" mode=""></image>
			</view>
			<view class="top-bar-center title">宠物名片</view>
			
		</view>
		<view class="pet-list" v-show="!isModfiy && isList">
			<view class="pet-title">
				<image  src="../../static/pet/love.png" mode=""></image>
				宠物名片
			</view>
			<view class="pet-item">
				姓名
				<view class="pet-msg" v-if="id == uid" @tap="modify('petName','姓名',user.petName)">
					{{user.petName}}
				</view>
				<view class="pet-msg" v-if="id != uid">
					{{user.petName}}
				</view>
			</view>
			<view class="pet-item">
				性别
				<view class="pet-msg">
					<picker @change="bindPickerChange" :value="index" :range="array" v-if="id == uid">
						<view class="uni-input">{{array[index]}}</view>
					</picker>
					<view class="uni-input"  v-if="id != uid">{{array[index]}}</view>
				</view>
			</view>
			<view class="pet-item">
				品种
				<view class="pet-msg" v-if="id == uid" @tap="modify('varieties','品种',user.varieties)">
					{{user.varieties}}
				</view>
				<view class="pet-msg" v-if="id != uid">
					{{user.varieties}}
				</view>
			</view>
			<view class="pet-item">
				联系方式
				<view class="pet-msg" v-if="id == uid" @tap="modify('phone','电话',user.phone)">
					{{user.phone}}
				</view>
				<view class="pet-msg" v-if="id != uid" >
					{{user.phone}}
				</view>
			</view>
			<view class="pet-item">
				爱好
				<view class="pet-msg" >
					吃饭
				</view>
			</view>
			<view class="pet-item">
				生日
				<view class="pet-msg">
					<picker mode="date" v-if="id == uid" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
					    <view class="uni-input">{{date}}</view>
					 </picker>
					 <view class="uni-input" v-if="id != uid">{{date}}</view>
					</view>
			</view>
		</view>
		<view class="modify" :style="{bottom:-+widHeight+'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="modifyStbmitBack">取消</view>
				<view class="title">{{modifyTitle}}</view>
				<view class="define" @tap="modifyStbmit">确定</view>
			</view>
			<view class="modify-main">
				
				<textarea v-model="data" class="modify-content"></textarea>
				
			</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "../../components/ling-imgcropper/ling-imgcropper.vue";
	import myfun from "../../common/js/myfun.js"
	export default {
		
		data() {
			const currentDate = this.getDate({
			          format: true,
									})
			return {
				isList:true,
				user:{},
				cropFilePath:'../../static/img/one.jpg',
				tempFilePath: '',
				index: '' ,
				oldindex:'',
				uid:'',
				id:'',
				array:['弟弟','妹妹','未知'],
				modifyTitle:'',
				type:'',
				oldData:'',				//原始数据
				data:'修改内容',			//修改内容
				animationData:{},			//动画
				isModfiy:false,				//动画开关
				widHeight:'1000',				//页面高度
				date: currentDate,
				pwd:''
			};
		},
		components: {ImageCropper},
		onLoad:function(e){
			this.id = e.id;
			this.getStorage()
			this.getUser()
		},
		computed: {
		      startDate() {
		          return this.getDate('start');
		      },
		      endDate() {
		          return this.getDate('end');
		      }
		  },
		methods:{
			cancel:function(){
				this.isList = !this.isList
			},
			//图片上传
			confirm (e){
						this.isList = !this.isList
			             this.tempFilePath = "";
			             this.cropFilePath = e.detail.tempFilePath;
						
			             
			             uni.uploadFile({
			               url: this.serverUrl+'/files/upload',
			               filePath: this.cropFilePath,
			               name: "file",
			               fileType: "image",
			              formData: {
			              		url:'pet-user',
								name:this.uid,
								token:this.token
						  },
			               success: (uploadFileRes) => {
			                 var backstr =this.serverUrl+'/'+uploadFileRes.data
							 // .replace('data/user/',"");
							 // console.log(backstr)
			                 //存储用户信息修改
							 // try{
							 // 	uni.setStorageSync('user',{
							 // 		'id':this.uid,
							 // 		'name':this.name,
							 // 		'petimg':backstr,
							 // 		'token':this.token
							 // 	});
							 // }catch(e){
							 // 	//error
							 // 	console.log('数据存储出错');
							 // }
							 //存储头像到数据库
							 this.update(backstr,'petImg',undefined)
			               },
			       
			              fail:(res)=>{
			              	this.isList = !this.isList
			              }
			             });
			       
			            
			           },
			//返回
			backOne:function(){
			
				        uni.navigateBack({
				             delta: 1        //跳转十五层  回到第一层页面
				        })
				
			},
			//获取存储数据
			getStorage:function(){
				const value = uni.getStorageSync('user')
				if(value){
						 this.uid =value.id;
						 this.token = value.token;
						 
					
				}
			
				else{
					//如果没有数据缓存，跳转到登陆页面
					uni.redirectTo({
						url:'../login/login',
					})
				}
				
					
			},
			//头像裁剪
			upload() {
				
			            uni.chooseImage({
			                count: 1, //默认9
			                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			                sourceType: ['album','camera'], //从相册选择
			                success: (res) => {
			                     this.tempFilePath = res.tempFilePaths.shift()
								this.isList = !this.isList
							},
							
			            });
			        },
			//时间处理
			changeTime: function(date){
				return myfun.datialTime(date);
			},
			//性别判断
			sexJudge:function(e){
				if(e == 'female'){
					//女性
					this.index = 1;
				}else if(e == 'male'){
					//男性
					this.index =0;
				}else{
					//未知
					this.index =2;
				}
			},
			//性别选择器
			 bindPickerChange: function(e) {
				  this.oldindex = this.index
			      this.index = e.target.value
				  if(this.index != this.oldindex){
					  let sex = 'asexual';
					  if(this.index==0){
					  		sex = 'male';
					  }else if(this.index ==1){
					  			sex = 'female'
					  }
					  this.update(sex,'petSex',undefined)
				  }
				  
			   },
			   //时间选择器
			bindDateChange: function(e) {
				let olddate = this.date;
				this.date = e.target.value;
				if(this.date != olddate){
					this.update(this.date,'petBirth',undefined);
				}
				
			},
			//获取用户
			getUser:function(){
				uni.request({
					url: this.serverUrl + '/user/detial',		//获取用户信息
					data: {
						id:this.id,
						token:this.token,
					},
					method: "POST",
					success: (data) => {
						console.log("后台返回的数据")
						if(data.data.result.length == 0){
							uni.navigateTo({
								url:'../login/login',
							})
						}
						else{
							let status = data.data.status;
							if (status == 200) {
								//访问后端成功
								let res = data.data.result[0];
								this.cropFilePath = res.petImg;
								
								
								//处理生日 
								if(res.petBirth == undefined){
									console.log(res)
									this.date = '0000-00-00';
									
								}
									else{
										let birth = myfun.detialTime1(res. petBirth)
										this.date =birth;
									}
								//处理电话
								if(res.phone == undefined){
									res.phone = '000';
								}
								
								this.sexJudge(res.petSex);
								this.user = res; 
								// console.log("需要渲染的数据")
								// console.log(this.user);
							} else if (status == 500) {
								uni.showToast({
									title: '服务器出错了！',
									duration: 2000, //显示时间
									icon: 'none'
								})
							}
						}
						
					}
				})
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
			//修改
			modify:function(t,type,data){	
				this.pwd = undefined;
				this.type = t;
				this.modifyTitle=type;
				this.oldData = data;
				this.data = data;
				this.modifyStbmitBack()
			},
			modifyStbmit:function(){
				
				//提交修改
				if(this.data.length>0 &&this.data != this.oldData){
						this.update(this.data,this.type,this.pwd);	
						this.user[this.type] = this.data
				}
				//关闭弹出层
				this.modify();
			
			},
			modifyStbmitBack:function(){
				var animation = uni.createAnimation({
					duration:300,
					timingFunction:'ease',
				})
				this.isModfiy = !this.isModfiy;
				if(this.isModfiy){
					animation.bottom(0).step();
				}else{
					animation.bottom(-this.widHeight).step();
				}
				this.animationData =animation.export()
			},
			//数据修改
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
					uni.showToast({
						title: '修改成功！',
						duration: 2000, //显示时间
						icon: 'none'
					})
						
						
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
				getDate(type) {
				        const date = new Date();
				        let year = date.getFullYear();
				        let month = date.getMonth() + 1;
				        let day = date.getDate();
						
				        if (type === 'start') {
				            year = year - 60;
				        } else if (type === 'end') {
				            year = year + 2;
				        }
				        month = month > 9 ? month : '0' + month;;
				        day = day > 9 ? day : '0' + day;
				        return `${year}-${month}-${day}`;
			},
		},
		
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
		
		margin-top: 0rpx;
		border-bottom: 1px solid $uni-border-color;
		.pet-img{
			z-index: 1003;
			width: 100%;
			height: 700%;
		}
		.title{
			z-index: 1003;
			font-size: 45rpx;
			color:#FFFFFF
			}
		.back-img{
			z-index: 1005;
			position: absolute;
			top: 0;
		}
	}
	.pet-list{
		width: 95%;
		height: 900rpx;
		border-radius: 19rpx;
		background-color:#FFFFFF;
		box-shadow: 1px 1px 1px #888888 ;
		position: absolute;
		top:350rpx;
		z-index: 100;
		left:27rpx;
		.pet-title{
			margin: 50rpx 12rpx 12rpx 50rpx;
			font-size: 40rpx;
			font-weight: bold;
			image{
				margin-bottom: -10rpx;
				margin-right: 30rpx;
				width: 60rpx;
				height: 60rpx;
			}
		}
		.pet-item{
			position: relative;
			margin: 40rpx;
			padding: 17rpx;
			font-weight: bold;
			.pet-msg{
				color: rgba(128,128,128,1);
				position: absolute;
				left:30%;
				display: inline-block;
			
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
</style>
