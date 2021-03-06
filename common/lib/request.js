import $store from '@/store/index.js'
export default {
	// 全局配置
	common:{
		baseUrl:"http://ceshi3.dishait.cn/api",
		header:{
			'Content-Type':'application/json;charset=UTF-8',
			'Content-Type':'application/x-www-form-urlencoded'
		},
		data:{},
		method:'GET',
		dataType:'json'
	},
	// 请求 返回promise
	request(options = {}){
		// 组织参数
		options.url = /47.106.125.164/.test(options.url) ? options.url : this.common.baseUrl + options.url
		options.header = options.header || this.common.header
		options.data = options.data || this.common.data
		options.method = options.method || this.common.method
		options.dataType = options.dataType || this.common.dataType
		
		// token
		if (options.token) {
			options.header.Authorization = $store.state.user.token
			
			// 二次验证
			if (options.checkToken && !options.header.Authorization){
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				})
				return uni.navigateTo({
					url: '/pages/login/login'
				})
			}
		}
		
		delete(options.token)
		
		// 请求
		return new Promise((res,rej)=>{
			// 请求之前... todo
			// 请求中...
			uni.request({
				...options,
				success: (result) => {
					console.log(result)
					result.data.code = result.data.code ? result.data.code : result.statusCode
					// 服务端失败
					if(result.statusCode !== 200 || result.data.code !== 200){
						if (options.toast !== false) {
							uni.showToast({
								title: result.data.msg || '服务端失败',
								icon: 'none'
							})
						}
						
						return rej(result.data) 
					}
					
					// 成功
					let data = result.data.data
					res(data)
				},
				fail: (error) => {
					console.log(error)
					uni.showToast({
						title: error.errMsg || '请求失败',
						icon: 'none'
					});
					return rej(error)
				}
			});
		})
	},
	// get请求
	get(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	// post请求
	post(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	// delete请求
	del(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	},
	// PUT请求
	put(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'PUT'
		return this.request(options)
	}
	// 错误处理
	// errorCheck(err, res, 
	// errfun = false, resfun = false) {
	// 	if (err) {
	// 		typeof errfun === 'function' && errfun()
	// 		uni.showToast({ title: '加载失败', icon: "none" })
	// 		return false
	// 	}
	// 	if (res.data.errorCode) {
	// 		typeof resfun === 'function' && resfun()
	// 		uni.showToast({ title: res.data.msg, icon: "none" })
	// 		return false
	// 	}
	// 	return true
	// }
}