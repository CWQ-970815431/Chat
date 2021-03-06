<template>
	<view class="emoji" :style="{height:height+'px'}">
		<view class="emoji-line" v-for="(line,i) in emoji" :key="i">
			<view class="emoji-line-item" v-for="(item,index) in line" :key="index+item" @tap="clickEmoji(item)">{{item}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			height:{
				type:Number,
				default:260
			}
		},
		data() {
			return {
				emoji:[
					['😀','😖','😞','😟','😤','😢','😭'],
					['😦','😨','😩','😬','😰','😱','😳'],
					['😵','😡','😠','😷','🤒','🤕','🤢'],
					['🤧','😇','🤠','🤡','🤥','🤓','😈'],
					['👿','👹','👺','💀','👻','👽','🤖'],
					['💩','😺','😸','😹','😻','😼','😽'],
					['🙀','😿','😾','🏻','🏼','🏽','🏾'],
					['🏿','🗣','👤','👥','👫','👬','👭'],
					['👂','👂🏻','👂🏼','👂🏽','👂🏾','👂🏿','👃'],
					['👃🏻','👃🏼','👃🏽','👃🏽','👃🏿','👣','👀'],
					['👁','👅','👄','💋','👓','🕶','👔'],
					['👖','👗','👘','👙','👚','👛','👜'],
					['👝','🎒','👞','👟','👟','👠','👡'],
					['👢','👑','👒','🎩','🎓','⛑','💄'],
					['💍','🌂','💼','🎒','👞','👟','']
				]
			};
		},
		methods:{
			clickEmoji:function(e){
				
				this.$emit('emotion',e)
			}
		}
	}
</script>

<style lang="scss">
	.emoji{
		width: 100%;
		padding: 10rpx;
		box-sizing: border-box;
		overflow:hidden;
		overflow-y: auto;
		padding-bottom: 200rpx;
		.emoji-line{
			padding-top: 20rpx;
			display: flex;
			.emoji-line-item{
				flex:1;
				text-align: center;
				font-size: 48rpx;
				line-height: 78rpx;
			}
		}
	}
</style>
