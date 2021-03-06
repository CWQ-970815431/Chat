export default{
	//首页时间转化
	dateTime(e){
		let old = new Date(e);
		let now = new Date();
		//获取old具体时间
		let od = old.getDate();
		let oh = old.getHours();
		let om = old.getMinutes();
		let oY = old.getFullYear();
		let oM = old.getMonth()+1;
		let oD = old.getDate();
		
		//获取nows具体时间
		let nd = now.getDate();
		let nh = now.getHours();
		let nm = now.getMinutes();
		let nY = now.getFullYear();
		let nM = now.getMonth()+1;
		let nD = now.getDate();
		
		//当天的时间
		if(oD === nD && oM === nM && oY===nY){
			if(oh<10){
				oh = '0'+oh; 
			}
			if(om<10){
				om = '0'+om; 
			}
			return oh+":"+om;
		}
		//昨天的时间
		
		if(oD+1 === nD && oM === nM && oY===nY){
			if(oh<10){
				oh = '0'+oh; 
			}
			if(om<10){
				om = '0'+om; 
			}
			return '昨天 '+oh+":"+om;
		}
		//前天的时间
		else if(oD+2 === nD && oM === nM && oY===nY){
			if(oh<10){
				oh = '0'+oh; 
			}
			if(om<10){
				om = '0'+om; 
			}
			return '前天'+oh+":"+om;
		}else{
			//大于两天
			return oY+'/'+oM+'/'+oD
		}
	},
	//聊天时间
	dateTime1(e){
		let old = new Date(e);
		let now = new Date();
		//获取old具体时间
		let od = old.getDate();
		let oh = old.getHours();
		let om = old.getMinutes();
		let oY = old.getFullYear();
		let oM = old.getMonth()+1;
		let oD = old.getDate();
		
		//获取nows具体时间
		let nd = now.getDate();
		let nh = now.getHours();
		let nm = now.getMinutes();
		let nY = now.getFullYear();
		let nM = now.getMonth()+1;
		let nD = now.getDate();
		
		//当天的时间
		if(oD === nD && oM === nM && oY===nY){
			if(oh<10){
				oh = '0'+oh; 
			}
			if(om<10){
				om = '0'+om; 
			}
			return oh+":"+om;
		}
		//昨天的时间
		
		if(oD+1 === nD && oM === nM && oY===nY){
			if(oh<10){
				oh = '0'+oh; 
			}
			if(om<10){
				om = '0'+om; 
			}
			return '昨天 '+oh+":"+om;
		}
		//前天的时间
		else if(oD+2 === nD && oM === nM && oY===nY){
			if(oh<10){
				oh = '0'+oh; 
			}
			if(om<10){
				om = '0'+om; 
			}
			return '前天'+oh+":"+om;
		}else if(oY === nY){
			if(oh<10){
				oh = '0'+oh; 
			}
			if(om<10){
				om = '0'+om; 
			}
			//今年
			return oM+'月'+oD+'日'+oh+":"+om;
		}else{
			if(oh<10){
				oh = '0'+oh; 
			}
			if(om<10){
				om = '0'+om; 
			}
			//不是今年的
			return oY+'年'+oM+'月'+oD+'日'+oh+":"+om;
		}
	},
	//文件夹使用时间
	fileName(e){
		let old = new Date(e);
		
		let oY = old.getFullYear();
		let oM = old.getMonth()+1;
		let oD = old.getDate();
		
		
		if(oM<10){
			oM = '0'+oM
		}
		if(oD<10){
			oD = '0'+oD;
		}
			return oY+oM+oD;
		},

	//详细时间转换
	datialTime(e){
		let old = new Date(e);
		//获取old具体时间
		let d = old.getTime();
		let h = old.getHours();
		let m = old.getMinutes();
		let Y = old.getFullYear();
		let M = old.getMonth();
		let D = old.getDate();
		
		//处理时间
		if(M<10){
			M = '0'+M;
		}
		if(D<10){
			D = '0'+D;
		}
		if(h<10){
			h ='0'+h;
		}
		if(m<10){
			m = '0'+m;
		}
		return Y+'-'+M+'-'+D+' '+h+':'+m;
	
	},
	//详细时间转换
	detialTime1(e){
		let old = new Date(e);
		//获取old具体时间
		let oY = old.getFullYear();
		let oM = old.getMonth()+1;
		let oD = old.getDate();
		
		//处理时间
		if(oM<10){
			oM= '0' +oM;
		}
		if(oD<10){
			oD= '0' +oD;
		}
		return oY+'-'+oM+'-' +oD+" "
	},
	//间隔时间
	spacTime(old,now){
		old = new Date(old)
		now = new Date(now)
		var told = old.getTime();
		var tnow = now.getTime();
		if(told> (tnow+1000*60*5)){
			return now	;
		}else{
			return ''
		}
		},
		
	//防抖函数
	debounce(fn, t){
    let delay = t || 500;
    let timer;
    return function () {
        let args = arguments;
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            fn.apply(this, args);
        }, delay);
    }
},
Msort(arr,obj,tip){
		if(tip ==0 ){
			//降序排序
			for(let i = 1;i<arr.length;i++){
				for(let j = i;j>0;j--){
					if(arr[j][obj]>arr[j-1][obj]){
						let s = arr[j];
						arr[j] = arr[j-1];
						arr[j-1] = s;
					}
				}
			}
			return arr;
		}else if(tip == 1 ){
			//升序排序
			for(let i = 1;i<arr.length;i++){
				for(let j = i;j>0;j--){
					if(arr[j][obj]<arr[j-1][obj]){
						let s = arr[j];
						arr[j] = arr[j-1];
						arr[j-1] = s;
					}
				}
			}
			return arr;
		}
	}
}