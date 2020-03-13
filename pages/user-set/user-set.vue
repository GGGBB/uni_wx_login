<template>
	<view>
		<card v-if="loginStatus" :headTitle="item.label" bodyStyle="background:#ffffff;"
		v-for="(item,index) in ctrl" :key="index">
			<uni-list-item :title="list.title" v-for="(list,listIndex) in item.value"
			:key="listIndex" @click="navigate(list.path)"></uni-list-item>
		</card>
		<card :headTitle="item.label" bodyStyle="background:#ffffff;"
		v-for="(item,index) in list" :key="index">
			<uni-list-item :title="list.title" v-for="(list,listIndex) in item.value"
			:key="listIndex" @click="navigate(list.path)"></uni-list-item>
		</card>
		<view class="p-3" v-if="loginStatus">
			<button type="default" class="bg-white" @click="logoutEvent">退出登录</button>
		</view>
	</view>
</template>

<script>
	import card from "@/components/common/card.vue"
	import uniListItem from "@/components/uni-ui/uni-list-item/uni-list-item.vue"
	import { mapMutations, mapState } from 'vuex'
	export default {
		components: {
			card,
			uniListItem
		},
		data() {
			return {
				ctrl:[{
						label:"账号管理",
						value:[
							{ title:"个人资料",path:"" },
							{ title:"收货地址",path:"" },
						]
					}],
				list:[
					{
						label:"关于",
						value:[
							{ title:"关于商城",path:"about" },
							{ title:"意见反馈",path:"" },
							{ title:"协议规则",path:"" },
							{ title:"资质证件",path:"" },
							{ title:"用户协议",path:"" },
							{ title:"隐私政策",path:"" },
						]
					},
				],
				address:{
					province_id: 0,
					province_str: "",
					city_id: 1,
					city_str: "北京",
					district_id: 1,
					district_str: "东城区",
					address: "sdfsdfsd",
					recv_mobile: "18098949484",
					recv_name: "小明",
					latitude: 0,
					longitude: 0,
					is_default: 1
				}
			}
		},
		computed: {
			...mapState({
				loginStatus: state => state.user.loginStatus,
				token: state => state.user.userInfo.token
			})
		},
		methods: {
			...mapMutations(['logout']),
			navigate(path){
				if (!path) return;
				uni.navigateTo({
					url: `/pages/${path}/${path}`
				});
			},
			// 退出登录
			// logoutEvent() {
			// 	this.$H.post('/logout',{},{
			// 		token: true,
			// 		toast: false
			// 	}).then(res => {
			// 		this.logout()
			// 		uni.showToast({
			// 			title: '退出成功',
			// 			icon: 'none'
			// 		})
			// 		uni:uni.navigateBack({
			// 			delta: 1
			// 		})
			// 	})
			// }
			
			logoutEvent() {
				console.log(this.token)
				this.$H.post('http://47.106.125.164/api.v1/micro-app/order',{},{
				}).then(res => {
					console.log(res)
					// this.logout()
					// uni.showToast({
					// 	title: '退出成功',
					// 	icon: 'none'
					// })
					// uni:uni.navigateBack({
					// 	delta: 1
					// })
				})
			}
		}
	}
</script>

<style>
page{
	background: #EEEEEE;
}
</style>
