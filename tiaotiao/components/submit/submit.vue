<template>
		<view class="submit">
			<view class="submit-chat">
				<view class="bt-img">
					<image  :src="toc" @tap="record " mode=""></image>
				</view>
				
					<textarea @focus="focus" v-model="msg" :class="{displaynone:isrecord}" @input="inputs" auto-height="true" class="btn chat-send" value="" placeholder="" />
					<view class="record btn" :class="{displaynone:!isrecord}" v-if="">
						按住说话
					</view>
				<view class="bt-img" @tap="emoji">
					<image  src="../../static/chat/biaoqin.jpg" mode=""></image>
				</view>
				<view class="bt-img" @tap="showMore">
					<image  src="../../static/chat/Add.jpg"  mode=""></image>
				</view>
			</view>
			<view class="emoji" :class="{displaynone:isemoji}" >
				<view class="emoji-send">
					<view class="emoji-send-det" @tap="emojiBack">
						<image src="../../static/chatroom/tuige.png" mode=""></image>
					</view>
					<view class="emoji-send-bt" @tap="emojiSend">发送</view>
				</view>
				<emoji :height="260" @emotion="emotion"></emoji>
			</view>
			<view class="more" :class="{displaynone:ismore}" >
				<view class="more-list" @tap="sendImg('album')">
					<image src="../../static/chatroom/imagehome.png"></image>
					<view class="more-list-title">图片</view>
				</view>
				<view class="more-list" @tap="sendImg('camera')">
					<image src="../../static/chatroom/takephoto.png"></image>
					<view class="more-list-title">拍摄</view>
				</view>
				<view class="more-list">
					<image src="../../static/chatroom/position.png"></image>
					<view class="more-list-title">位置</view>
				</view>
				<view class="more-list">
					<image src="../../static/chatroom/shiping.png"></image>
					<view class="more-list-title">视频</view>
				</view>
				<view class="more-list">
					<image src="../../static/chatroom/wenjian.png"></image>
					<view class="more-list-title">文件</view>
				</view>
			</view>
			
	</view>
</template>

<script>
	import emoji from './emoji/emoji.vue'
	export default {
		
		data() {
			return {
				isrecord:false,
				isemoji:true,
				ismore:true,
				toc:'../../static/chat/yuyin.jpg',
				msg:''
			};
		},
		components:{
			emoji,
		},
		methods:{
			//获取模块高度
			getElementHeight:function(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.submit').boundingClientRect(data => {
					this.$emit('heights',data.height)
				}).exec();
			},
			//音频与键盘输入切换
			record:function(){
						this.isemoji =true
						this.ismore = true
				if(this.isrecord){
					this.isrecord = !this.isrecord;
					this.toc="../../static/chat/yuyin.jpg"
				}else{
					this.isrecord = !this.isrecord;
					this.toc="../../static/chatroom/input.png"
				}
				setTimeout(()=>{ this.getElementHeight()},100)
			},
			inputs:function(e){
				var chatm = e.detail.value;
				var pos = chatm.indexOf('\n')
				if(pos != -1 && chatm.length>1){
					this.send(this.msg,0)
					
				}
			},
			//表情
			emoji:function(){
					this.ismore = true
					this.isemoji = !this.isemoji
					setTimeout(()=>{ this.getElementHeight()},100)
			},
			
			//接收表情
			emotion:function(e){
				this.msg = this.msg+e
			},
			//表情发送
			emojiSend:function(){
				if(this.msg.length>0){
					this.send(this.msg,0)
					
				}
				},
			//输入框聚焦
			focus:function(){
				this.isemoji =true
				setTimeout(()=>{ this.getElementHeight()},100)
			},
			//表情包撤回
			emojiBack:function(){
				if(this.msg.length>0){
					this.msg = this.msg.substring(0, this.msg.length-1)
					
				}
			},
			//发送
			send:function(msg,types){
				let data = {
					message:msg,
					types:types
				}
				this.$emit('inputs',data)
				setTimeout(()=>{ this.msg=''},0)
			},
			//更多
			showMore:function(){
				this.ismore = !this.ismore 
				this.isemoji= true
				setTimeout(()=>{ this.getElementHeight()},100)
			},
			//图片选择
			sendImg:function(e){
				let count = 9;
				if(e != 'album'){
					count = 1
				}
				uni.chooseImage({
				    count: count, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: [e], //从相册选择
				    success: (res) =>{
						console.log(res)
						const filePath =res.tempFilePaths
						
				        for(let i = 0 ;i < filePath.length;i++){
							this.send(filePath[i],1)
						}
				    }
				});
			}
		}
	}
</script>

<style lang="scss">
	.submit{
		border-top: 1px solid $uni-border-color;
		background: rgba(244,244,244,0.96);
		width:100%;
		position: fixed;
		bottom: 0;
		z-index: 100;
		padding-bottom:env(safe-area-inset-bottom);;;
		
	}
	.displaynone{
		display: none;
	}
	.submit-chat{
		width: 100%;
		display: flex;
		align-items: flex-end;
		box-sizing: border-box;
		padding: 14rpx 14rpx;
		image{
			width: 56rpx;
			height: 56rpx;
			margin: 0 10rpx;
			flex: auto;
		}
		.btn{
			flex:auto;
			background: #FFFFFF;
			border-radius: 10rpx;
			padding: 20rpx;
			max-height: 160rpx;
			margin: 0 10rpx;
		}
		.record{
			text-align: center;
			font-size:32rpx;
			color: rgba(39,40,50,0.6);
		}
		
		}
		
		.emoji{
			width: 100%;
			height: 460rpx;
			background: rgba(236,237,238,1);
			box-shadow: 0px -1rpx 0rpx 0px rgba(0,0,0,0.1);
			.emoji-send{
				width: 260rpx;
				height: 104rpx;
				padding-top: 24rpx;
				background-color: rgba(236,237,238,0.9);
				position: fixed;
				bottom: env(safe-area-inset-bottom);
				right: 0;
				display: flex;
				.emoji-send-bt{
					flex:1;	
					margin: 0 32rpx 0 20rpx;
					height: 86rpx;
					background:rgba(255,228,49,1) ;
					font-size: 32rpx;
					text-align: center;
					line-height: 80rpx;
					border-radius: 12rpx;
				}
				.emoji-send-det{
					flex:1;
					margin-left: 24rpx;
					height: 86rpx;
					background:#fff ;
					font-size: 32rpx;
					text-align: center;
					line-height: 93rpx;
					border-radius: 12rpx;
					padding-top: 4rpx;
					image{
						width: 48rpx;
						height: 36rpx;
					}
				}
				}
		}
		.more{
			width: 100%;
			height: 460rpx;
			background: rgba(236,237,238,1);
			box-shadow: 0px -1rpx 0rpx 0px rgba(0,0,0,0.1);
			bottom: env(safe-area-inset-bottom);
			padding: 0 20rpx;
			box-sizing: border-box;
			.more-list{
				width: 25%;
				text-align: center;
				float: left;
				margin-top: 52rpx;
				image{
					width: 72rpx;
					height: 72rpx;
					padding: 24rpx;
					background: rgba(255,255,255,1);
					border-radius: 24rpx;
				}
				.more-list-title{
					font-size: 24rpx;
					color: rgba(39,40,50,0.5);
					line-height: 34rpx;
				}
			}
		}
</style>
