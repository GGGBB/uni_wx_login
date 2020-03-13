import $H from '@/common/lib/request.js';

export default {
	state: {
		// 登录状态
		loginStatus: false,
		// token
		token: null,
		// 用户信息
		userInfo:{}
	},
	mutations:{
		// 初始化登录状态
		async initUser( state ) {
			let userInfo = uni.getStorageSync('userInfo')
			if (userInfo) { userInfo = JSON.parse(userInfo) }
			try{
				if (!userInfo.token) { throw '不合法token' }
				state.token = userInfo.token
				const res = await $H.post('http://47.106.125.164/api.v1/micro-app/login-check',{},{token:true})
				console.log(res)
				userInfo.token = res.token
				state.userInfo = userInfo
				state.token = userInfo.token
				state.loginStatus = true
				console.log(state.loginStatus)
				// 持久化存储
				uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
			}catch(e){
				console.log(e)
				state.userInfo = {}
				state.loginStatus = false
				state.token = null
				uni.removeStorageSync('userInfo')
			}
		},
		// 登录
		login(state, userInfo){
			state.userInfo = userInfo
			state.token = userInfo.token
			state.loginStatus = true
			// 持久化存储
			uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
		},
		// 退出登录
		logout(state){
			state.userInfo = {}
			state.loginStatus = false
			state.token = null
			uni.removeStorageSync('userInfo')
		}
	}
}