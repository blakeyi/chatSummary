const app = getApp()
let userInfo = app.globalData.userInfo;
Page({
	data: {
		timeout: [
			{ text: "不开启" },
			{ text: "播放当前声音关闭" },
			{ text: "播放2首声音关闭" },
			{ text: "播放3首声音关闭" },
			{ text: "播放4首声音关闭" },
			{ text: "10分钟后" },
			{ text: "20分钟后" },
			{ text: "30分钟后" },
		],
		activeIndex: 0,
		login: false,
		avatarUrl: "",
		nickName: ""
	},

	onLoad() {
		const that = this;
		//获得设备信息
		wx.getSystemInfo({
			success(res) {
				that.setData({
					phoneHeight: res.windowHeight,
				})
			}
		})
	},
	onShow() {

	},
	getUserProfile(e) {
		// 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
		// 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
		let that = this
		wx.getUserProfile({
			desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
			success: (res) => {
				console.log(res)
				wx.setStorage({
				  key: "userinfo",
				  data: JSON.stringify(res.userInfo)
			  })
			  that.setData({
				  login: true,
				  avatarUrl: res.userInfo.avatarUrl,
				  nickName: res.userInfo.nickName
			  })
			}
		})
	},

	phoneLogin() {
		wx.navigateTo({
			url: './phoneLogin/phoneLogin',
		});
	},
	gotoLogin() {
		wx.navigateTo({
			url: './phoneLogin/phoneLogin',
		});
	},
	openSwitch() {
		const that = this;
		that.setData({
			show: true
		})
	},
	close() {
		const that = this;
		that.setData({
			show: false
		})
	},
	chooseTimeOut(e) {
		const that = this;
		that.setData({
			activeIndex: e.currentTarget.dataset.activeindex
		})
	}
})