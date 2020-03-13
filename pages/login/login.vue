<template>
	<view>
		<uni-status-bar />
		
		<!-- #ifndef MP-WEIXIN  -->
		<view class="d-flex a-center j-sb py-2 px-3 text-light-muted">
			<view class="iconfont icon-shanchu1" @click="goBack"></view>
			<view class="font-md" @click="forget">忘记密码</view>
		</view>
		
		<view class="p-5">
			<view class="font-big mb-5">密码登录</view>
			
			<input type="text" class="border-bottom mb-4 uni-input px-0"
			placeholder="请输入手机号/邮箱/账号" v-model="username"
			placeholder-class="text-light-muted"
			@focus="focus('username')" @blur="blur('username')"
			:class="focusClass.username ? 'input-border-color' : ''"/>
			
			<input type="text" class="border-bottom mb-4 uni-input px-0"
			placeholder="请输入密码" v-model="password"
			placeholder-class="text-light-muted"
			@focus="focus('password')" @blur="blur('password')"
			:class="focusClass.password ? 'input-border-color' : ''"/>
			<view class="py-2 w-100 d-flex a-center j-center main-bg-color text-white rounded font-md mb-4" hover-class="main-bg-hover-color" @click="submit">
				登录
			</view>
			<label class="checkbox d-flex a-center" @click="check = !check">
				<checkbox :checked="check"/>
				<text class="text-light-muted font">已阅读并同意XXXXX协议</text>
			</label>
		</view>
		<!-- #endif -->
		
		<!-- #ifdef MP-WEIXIN -->
		
		<view class="d-flex a-center j-sb py-2 px-3 text-light-muted">
			<view class="iconfont icon-shanchu1" @click="goBack"></view>
			<!-- <view class="font-md" @click="forget">忘记密码</view> -->
		</view>
		
		<view class="p-5">
			<!-- <view class="font-big mb-5">微信登录</view> -->
			<view class="d-flex flex-column a-center j-center p-5" style="bottom: 50rpx;">
				<image src="../../static/images/logo.png" style="height: 144rpx;width: 144rpx;border: 5rpx solid;" class="rounded-circle border-light"></image>
				<view class="font-weight p-2">百汇福</view>
			</view>
			
			
			<!-- <input type="text" class="border-bottom mb-4 uni-input px-0"
			placeholder="请输入手机号/邮箱/账号" v-model="username"
			placeholder-class="text-light-muted"
			@focus="focus('username')" @blur="blur('username')"
			:class="focusClass.username ? 'input-border-color' : ''"/>
			
			<input type="text" class="border-bottom mb-4 uni-input px-0"
			placeholder="请输入密码" v-model="password"
			placeholder-class="text-light-muted"
			@focus="focus('password')" @blur="blur('password')"
			:class="focusClass.password ? 'input-border-color' : ''"/> -->
			
			<view class="font-md mb-1">登录后开发者将获得以下权根</view>
			<label class="checkbox d-flex a-center mb-4" @click="check = !check">
				<checkbox :checked="check"/>
				<text class="text-light-muted font">获取你的公开信息(昵称、头像等)</text>
			</label>
			
			<button v-if="check" class="wx-bg-color py-2 w-100 d-flex a-center j-center text-white rounded-2 font-md mb-4" hover-class="wx-bg-hover-color" open-type="getUserInfo"
			@getuserinfo="mpGetUserInfo">
				微信登录
			</button>
		</view>
			
		<!-- #endif -->
	</view>
</template>

<script>
	import uniStatusBar from "@/components/uni-ui/uni-status-bar/uni-status-bar.vue"
	import { mapMutations, mapState } from 'vuex'
	export default {
		components: {
			uniStatusBar
		}, 
		data() {
			return {
				username:"",
				password:"",
				check:true,
				
				// 验证规则
				rules:{
					username:[
						// {
						// 	rule:/^[a-zA-Z]\w{5,17}$/,
						// 	msg:"账号必须字母开头，长度在6~18之间，只能包含字母、数字和下划线"
						// }
					],
					password:[
						// {
						// 	rule:/^.{5,20}$/,
						// 	msg:"密码长度必须为5-20个字符"
						// }
					]
				},
				
				focusClass:{
					username:false,
					password:false
				},
			}
		},
		computed: {
			...mapState({
				loginStatus: state => state.user.loginStatus,
			})
		},
		// watch: {
		// 	loginStatus(newValue, oldValue) {
		// 		if (this.loginStatus && getCurrentPages().length == 1) {
		// 			console.log(this.loginStatus + '-----')
		// 			uni.switchTab({
		// 				url: '/pages/index/index'
		// 			})
		// 		}
		// 	}
		// },
		methods: {
			// #ifdef MP-WEIXIN
			mpGetUserInfo(result) {
				console.log(result)
				uni.showLoading({ title: '登录中...', mask: true })
				// 获取失败
				if (result.detail.errMsg !== 'getUserInfo:ok') {
					uni.hideLoading()
					uni.showModal({
						title: '获取用户信息失败',
						content: '错误原因:' + result.detail.errMsg,
						showCancel: false
					})
					return
				}
				let userinfo = result.detail.userInfo
				uni.login({
					provider:'weixin',
					success: (res) => {
						console.log(res)
						// 登录
						this.$H.post('http://47.106.125.164/api.v1/micro-app/login',{
							code: res.code,
							nickName: userinfo.nickName,
							avatarUrl: userinfo.avatarUrl,
							gender: userinfo.gender,
						}).then(data => {
							if (!data.token) return
							userinfo.token = data.token
							this.login(userinfo)
							uni.hideLoading()
							uni.showToast({
								title: '登录成功',
								icon: 'none'
							});
							uni.navigateBack({
								delta: 1
							});
						})
					},
					complete: () => {
						uni.hideLoading()
					}
				})
			},
			// #endif
			
			
			...mapMutations(['login']),
			goBack(){
				uni.navigateBack({
					delta: 1
				});
			},
			// 表单验证
			validate(key){
				var check = true
				this.rules[key].forEach((v)=>{
					// 验证失败
					if (!(v.rule).test(this[key])) {
						uni.showToast({ title: v.msg, icon: 'none' });
						check = false
						return false
					}
				})
				return check
			},
			// 提交表单
			submit(){
				if (!this.check) {
					return uni.showToast({
						title: '请先同意XXXXX协议',
						icon: 'none'
					});
				}
				// 验证用户名
				if (!this.validate('username')) return;
				// 验证密码
				if (!this.validate('password')) return;
				
				console.log('提交成功');
				// uni.showLoading({
				// 	title: '登录中...',
				// 	mask: true
				// });
				this.$H.post('/login',{
					username:this.username,
					password:this.password
				}).then(res=>{
					console.log(res);
					// 状态存储
					this.login(res)
					uni.hideLoading()
					uni.showToast({
						title: '登录成功',
						icon: 'none'
					});
					uni.navigateBack({
						delta: 1
					});
				})
			},
			forget(){
				
			},
			focus(key){
				this.focusClass[key] = true
			},
			blur(key){
				this.focusClass[key] = false
			}
		}
	}
</script>

<style>

</style>
