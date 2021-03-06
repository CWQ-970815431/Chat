export default{
	frineds:function(){
		let friendarr = [
			{
				id:1,
				imgurl:'one.jpg',
				name:'大海',
				tip:233,
				time:new Date(),
				email:'892334519@qq.com',
				news:' TOP 常常遇到文章标题列表布局排版时候'
				
			},
			{
				id:2,
				imgurl:'two.jpg',
				name:'大地',
				tip:0,
				time:new Date(),
				email:'123123@qq.com',
				news:' asljdlkaskjd章标题列表布局排版时候'
				
			},
			{
				id:3,
				imgurl:'three.jpg',
				name:'阿拉斯加',
				tip:2,
				time:new Date(),
				email:'assda12@qq.com',
				news:' L到文章标题列表布局排版时候'
				
			},
			{
				id:4,
				imgurl:'four.jpg',
				name:'狼海',
				tip:12,
				time:new Date(),
				email:'89233412319@qq.com',
				news:' wegame在心理暗示建档立卡圣诞节常常遇到文章标题列表布局排版时候'
				
			},
			{
				id:5,
				imgurl:'one.jpg',
				name:'大海',
				tip:2,
				time:new Date(),
				email:'892213123@qq.com',
				news:' TOP 常常遇到文章标题列表布局排版时候'
				
			},
			{
				id:6,
				imgurl:'two.jpg',
				name:'大地',
				tip:0,
				time:new Date(),
				email:'89212312319@qq.com',
				news:' asljdlkaskjd章标题列表布局排版时候'
				
			},
			{
				id:7,
				imgurl:'three.jpg',
				name:'阿拉斯加',
				tip:2,
				time:new Date(),
				email:'89231231239@qq.com',
				news:' L到文章标题列表布局排版时候'
				
			},
			{
				id:8,
				imgurl:'four.jpg',
				name:'狼海',
				tip:12,
				time:new Date(),
				email:'892331239@qq.com',
				news:' wegame在心理暗示建档立卡圣诞节常常遇到文章标题列表布局排版时候'
				
			},
			{
				id:9,
				imgurl:'one.jpg',
				name:'大海',
				tip:2,
				time:new Date(),
				email:'89233ads19@qq.com',
				news:' TOP 常常遇到文章标题列表布局排版时候'
				
			},
			{
				id:10,
				imgurl:'two.jpg',
				name:'大地',
				tip:0,
				time:new Date(),
				email:'8923312319@qq.com',
				news:' asljdlkaskjd章标题列表布局排版时候'
				
			},
			{
				id:11,
				imgurl:'three.jpg',
				name:'阿拉斯加',
				tip:2,
				time:new Date(),
				email:'89212as9@qq.com',
				news:' L到文章标题列表布局排版时候'
				
			},
			{
				id:12,
				imgurl:'four.jpg',
				name:'狼海',
				tip:12,
				time:new Date(),
				email:'89233123z9@qq.com',
				news:' wegame在心理暗示建档立卡圣诞节常常遇到文章标题列表布局排版时候'
				
			},
		];
		return friendarr;
	},
	//好友关系
	isFriend:function(){
		let isfriend=[
			{
				userid:1,
				friend:2,
			},
			{
				userid:1,
				friend:5,
			},
			{
				userid:1,
				friend:6,
			},
			{
				userid:1,
				friend:8,
			},
		];
		return isfriend;
	},
	//聊天消息
	message:function(){
		let msgs =[
			{
				id:'a',
				imgurl:'four.jpg',
				message:' wegame在心理暗示建档立卡圣诞节常常遇到文章标题列表布局排版时候',
				types:0,		//内容类型（0文字，1图片，2音频）
				time:new Date()-1000,	//发送时间
				tip:0,
			},
			{
				id:'a',
				imgurl:'four.jpg',
				message:'卡圣诞节常常遇到文章标题列表布局排版时候',
				types:0,   //内容类型（0文字，1图片，2音频）
				time:new Date()-1000*16,    //发送时间
				tip:1,
			},
			{
				id:'b',
				imgurl:'three.jpg',
				message:'表布局排版时候',
				types:0,   //内容类型（0文字，1图片，2音频）
				time:new Date()-1000*36,    //发送时间
				tip:2,
			},
			{
				id:'a',
				imgurl:'four.jpg',
				message:'圣诞节常常遇到文章表布局排版时候',
				types:0,   //内容类型（0文字，1图片，2音频）
				time:new Date()-1000*60*46,    //发送时间
				tip:3,
			},
			{
				id:'b',
				imgurl:'three.jpg',
				message:'one.jpg',
				types:1,   //内容类型（0文字，1图片，2音频）
				time:new Date()-1000*60*60*16,    //发送时间
				tip:4,
			},
			{
				id:'b',
				imgurl:'three.jpg',
				message:'撒旦阿萨大大撒旦表布局排版时候',
				types:0,   //内容类型（0文字，1图片，2音频）
				time:new Date()-1000*60*60*26,    //发送时间
				tip:5,
			},
			{
				id:'a',
				imgurl:'four.jpg',
				message:'圣诞节常常遇到文章表布局排版时候',
				types:0,   //内容类型（0文字，1图片，2音频）
				time:new Date()-1000*60*60*46,    //发送时间
				tip:7,
			},
			{
				id:'a',
				imgurl:'four.jpg',
				message:'two.jpg',
				types:1,   //内容类型（0文字，1图片，2音频）
				time:new Date()-1000*60*60*66,    //发送时间
				tip:8,
			},
		]
		return msgs;
	}
}