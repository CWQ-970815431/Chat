<template>
	<view>
		<view class="upload" @tap="msg">上传图片</view>
		<image v-for="(item,index) in img"  :src="item" :key="item+index" mode=""></image>
	</view>
</template>

<script>
	import myfun from "../../common/js/myfun.js"
	export default {
		data() {
			return {
				id:'cqwq',
				img:[]
			};
		},
		methods:{
			upload:function(){
				//当前日期文件
				let url = myfun.fileName(new Date())
				uni.chooseImage({
					count: 9, //默认9 
					    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					    sourceType: ['album','camera'], //从相册选择
				    success: (chooseImageRes) => {
				        const tempFilePaths = chooseImageRes.tempFilePaths;
				    for(let i = 0 ; i < tempFilePaths.length ; i ++){
						const uploadTask = uni.uploadFile({
						    url:this.serverUrl+'/files/upload',//仅为示例，非真实的接口地址
						    filePath: tempFilePaths[i],
						    name: 'file',
						    formData: {
									url:url,
								 name:new Date().getTime()+this.id+i,
						    },
						    success: (uploadFileRes) => {
								let path = uploadFileRes.data;
								console.log(path)
								this.img.push(this.serverUrl+'/'+path)
						        console.log(this.img);
						    }
						});
						uploadTask.onProgressUpdate((res) => {
						    console.log('上传进度' + res.progress);
						    console.log('已经上传的数据长度' + res.totalBytesSent);
						    console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
										
						    // 测试条件，取消上传任务。
						    // if (res.progress > 50) {
						    //     uploadTask.abort();
						    // }
						});
					}
						
				
				        
				    }
				});
			},
			msg:function(){
			uni.request({
						url: this.serverUrl + '/chat/send',		
						data: {
							uid:'603745e0d628312a88e2a8f9',
							fid:'60375e594e4a683e9cc8ef31',
							message: 'test,test,test', //内容
							    types: 0,
							    time: new Date(), //生成时间
							    state: 1 ,//接受状态（0已读，1未读）
							token:this.token,
						},
						method: "POST",
						success: (data) => {
							console.log(data);
							let status = data.data.status;
							if (status == 200) {
								let res = data.data.result; 
							
								console.log(res);
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
	.upload{
		text-align: center;
		margin-top: 20rpx;
	}
</style>
