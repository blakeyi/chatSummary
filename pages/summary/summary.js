// index.js
// 获取应用实例
const app = getApp()
var _animation = wx.createAnimation({
  duration: _ANIMATION_TIME,
  timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
  delay: 0,
  transformOrigin: '50% 50% 0'
}); // 动画实体
var _animationIndex = 0; // 动画执行次数index（当前执行了多少次）
var _animationIntervalId = -1; // 动画定时任务id，通过setInterval来达到无限旋转，记录id，用于结束定时任务
const _ANIMATION_TIME = 500; // 动画播放一次的时长ms
var audioCtx = wx.createInnerAudioContext()
const bgImages = [
  "/images/summary/previous.jpg",
  "/images/summary/progress.jpg",
  "/images/summary/background.jpg",
  "/images/summary/main.jpg",
  "/images/summary/main1.jpg",
  "/images/summary/main1.jpg",
  "/images/summary/main2.jpg",
  "/images/summary/main1.jpg",
  "/images/summary/main3.gif",
]
var dataDesc = {}

Page({
  onReady: function (e) {
    //this.startProgress()
  },
  data: {
    animation: '',
    bgImage: bgImages[0],
    curStage: -1,
    played: false, // 是否正在播放
    curProgress: 0, // 当前进度条长度
    records: [],
    totalDays: "111",
    touchS:[],
    touchE:[]
  },
  touchStart: function (e) {
    // console.log(e.touches[0].pageX)
    let sx = e.touches[0].pageX
    let sy = e.touches[0].pageY
    this.setData({
      touchS:[sx, sy]
    })
  },
  touchMove: function (e) {
    let sx = e.touches[0].pageX;
    let sy = e.touches[0].pageY;
    this.setData({
      touchE:[sx, sy]
    })
  },
  touchEnd: function (e) {
    let start = this.data.touchS
    let end = this.data.touchE
    console.log(start)
    console.log(end)
    // 起点高度都要大于200,防止触发最上方按钮
    if (end[1] > 200 && start[1] > 200 && this.data.curStage >= 2 && this.data.curStage <= 8) {
      if ((start[1] < end[1] - 50) && this.data.curStage > 2) {
        console.log('下滑')
        this.nextPage(true)
      } else if ((start[1] > end[1] + 50) && this.data.curStage < 7) {
        console.log('上滑')
        this.nextPage(false)
      } else {
        console.log('静止')
      }
    }
  },
  stopPlay() {
    this.setData({
      curStage: -1,
      bgImage: bgImages[0]
    })
    this.stopAnimationInterval()
    audioCtx.stop()
    wx.showTabBar({
      animation: true,
    })
  },
  audioPlay() {
    if (this.data.played) {
      this.stopAnimationInterval()
      audioCtx.pause()
      this.setData({
        played: false
      })
    } else {
      this.startAnimationInterval()
      audioCtx.play()
      this.setData({
        played: true
      })
    }
  },
  onLoad: function () {
    // 计算认识了多少天
    var date1 = '2021/12/02 08:33:00'; //开始时间  
    var date2 = new Date(); //结束时间  
    var date3 = date2.getTime() - new Date(date1).getTime(); //时间差的毫秒数   
    var days = Math.floor(date3 / (24 * 3600 * 1000))
    this.setData({
      totalDays: "我们已经认识" + days.toString() + "天了"
    })
  },

  /**
   * 实现image旋转动画，每次旋转 120*n度
   */
  rotateAni: function (n) {
    _animation.rotate(120 * (n)).step()
    this.setData({
      animation: _animation.export()
    })
  },

  /**
   * 开始旋转
   */
  startAnimationInterval: function () {
    var that = this;
    that.rotateAni(++_animationIndex); // 进行一次旋转
    _animationIntervalId = setInterval(function () {
      that.rotateAni(++_animationIndex);
    }, _ANIMATION_TIME); // 每间隔_ANIMATION_TIME进行一次旋转
  },
  stopAnimationInterval: function () {
    if (_animationIntervalId > 0) {
      clearInterval(_animationIntervalId);
      _animationIntervalId = 0;
    }
  },
  startMain() {
    console.log("startMain")
    this.nextPage(false)
  },
  nextPage(previous) {
    let curStage = this.data.curStage
    console.log("curStage:", curStage)
    let records = this.data.records
    // 向前翻
    if (previous === true && curStage > 2) {
      curStage--
      this.setData({
        curStage: curStage,
        bgImage: bgImages[curStage + 1],
        curProgress: 101,
        records: records
      })
      return
    }
    // 向后翻
    curStage++
    console.log("curStage:", curStage)
    if (curStage == 1) {
      records = []
    } else if (curStage == 2) {
      console.log(dataDesc.dateDesc.count.count)
      let monthMsg = "这是我们认识的第" + (Math.floor(dataDesc.dateDesc.count.count / 30) + 1) + "个月"
      let sumMsg = "目前已经保持" + dataDesc.dateDesc.count.count + "天未中断"
      let page1 = [{
          type: "normal",
          message: "hi, 君君"
        },
        {
          type: "important",
          message: monthMsg
        },
        {
          type: "normal",
          message: "2021.12.02日我们第一次相遇"
        },
        {
          type: "normal",
          message: sumMsg
        },
      ]
      records.push(page1)
    } else if (curStage == 3) {
      console.log(dataDesc.dateDesc.count.count)
      let avgMsg = "我们平均每天发送了" + Math.floor(dataDesc.dateDesc.mean.count) + "条信息"
      let maxMsg = "最多的一天发了" + dataDesc.dateDesc.max.count + "条信息"
      let maxMsg1 = "那天是" + dataDesc.dateDesc.max.data[0]
      let minMsg = "最少的一天只发了" + dataDesc.dateDesc.min.count + "条信息"
      let minMsg1 = "可能" + dataDesc.dateDesc.min.data[0] + "那天都太忙了吧"
      let page2 = [{
          type: "normal",
          message: avgMsg
        },
        {
          type: "normal",
          message: maxMsg
        },
        {
          type: "important",
          message: maxMsg1
        },
        {
          type: "normal",
          message: minMsg
        },
        {
          type: "normal",
          message: minMsg1
        },
      ]
      records.push(page2)
    } else if (curStage == 4) {
      console.log(dataDesc.dateDesc.count.count)
      let avgMsg = "我们最常使用词语的前五是："
      let key1 = Object.keys(dataDesc.wordDesc[0])[0]
      let msg1 = key1 + " 次数：" + dataDesc.wordDesc[0][key1]
      let key2 = Object.keys(dataDesc.wordDesc[1])[0]
      let msg2 = key2 + " 次数：" + dataDesc.wordDesc[1][key2]
      let key3 = Object.keys(dataDesc.wordDesc[2])[0]
      let msg3 = key3 + " 次数：" + dataDesc.wordDesc[2][key3]
      let key4 = Object.keys(dataDesc.wordDesc[3])[0]
      let msg4 = key4 + " 次数：" + dataDesc.wordDesc[3][key4]
      let key5 = Object.keys(dataDesc.wordDesc[4])[0]
      let msg5 = key5 + " 次数：" + dataDesc.wordDesc[4][key5]
      let page3 = [{
          type: "important",
          message: avgMsg
        },
        {
          type: "important",
          message: msg1
        },
        {
          type: "normal",
          message: msg2
        },
        {
          type: "important",
          message: msg3
        },
        {
          type: "normal",
          message: msg4
        },
        {
          type: "important",
          message: msg5
        },
      ]
      records.push(page3)
    } else if (curStage == 5) {
      records.push([])
    } else if (curStage == 6) {
      let msg1 = "这一年 我们一起度过了圣诞节"
      let msg2 = "这一年 我们一起度过了元旦节"
      let msg3 = "2022.01.01日，我们在一起了!!!"
      let msg4 = "2022年 我们一起相互了解，相互进步，为我们的未来一起加油"
      let page6 = [{
          type: "normal",
          message: msg1
        },
        {
          type: "normal",
          message: msg2
        },
        {
          type: "important",
          message: msg3
        },
        {
          type: "important",
          message: msg4
        },
      ]
      records.push(page6)
    } else if (curStage == 7) {
      let avgMsg = "愿2022年我们能够快快乐乐，平平安安度过每一天"
      let msg1 = "愿今后的每一个除夕夜我都能陪你一起度过"
      let msg2 = "君君，新年快乐"
      let msg3 = "爱你每一天哟"
      let page3 = [{
          type: "important",
          message: avgMsg
        },
        {
          type: "important",
          message: msg1
        },
        {
          type: "important",
          message: msg2
        },
        {
          type: "important",
          message: msg3
        },
      ]
      records.push(page3)
    }
    this.setData({
      curStage: curStage,
      bgImage: bgImages[curStage + 1],
      curProgress: 101,
      records: records
    })
  },
  startProgress() {
    wx.hideTabBar()
    let that = this
    that.setData({
      curStage: 0,
      bgImage: bgImages[1],
      played: true
    })
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    audioCtx.src = '/music/奇妙之旅-抖音.mp3'
    audioCtx.autoplay = true
    _animationIndex = 0;
    _animationIntervalId = -1;
    this.data.animation = '';
    this.startAnimationInterval()
    wx.request({
      url: "https://blakeyi.cn/wx-api/query",
      data: {
        "id": "617e18386da017df678f0bbe"
      },
      dataType: "json",
      method: "POST",
      success: function (res) {
        console.log(res)
        dataDesc = res.data
      },
      fail: function (err) {
        console.log(err)
      }
    })

    setInterval(function () {
      let data = that.data.curProgress + 1
      if (data == 101) {
        that.nextPage(false)
        return
      }
      that.setData({
        curProgress: data
      })
    }, 50); // 每间隔_ANIMATION_TIME进行一次旋转
  }
})