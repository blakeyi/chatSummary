// index.js
// 获取应用实例
const app = getApp()
var _animation; // 动画实体
var _animationIndex = 0; // 动画执行次数index（当前执行了多少次）
var _animationIntervalId = -1; // 动画定时任务id，通过setInterval来达到无限旋转，记录id，用于结束定时任务
const _ANIMATION_TIME = 500; // 动画播放一次的时长ms
const bgImages = [
  "https://www.blakeyi.cn/images/progress.jpg",
  "https://www.blakeyi.cn/images/background.jpg",
  "https://www.blakeyi.cn/images/main.jpg",
  "https://www.blakeyi.cn/images/main1.jpg",
  "https://www.blakeyi.cn/images/main1.jpg",
  "https://www.blakeyi.cn/images/main2.jpg",
]
 var dataDesc = {}

Page({
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    const audioCtx = wx.createInnerAudioContext()
    audioCtx.src = 'pages/music/奇妙之旅-抖音.mp3'
    audioCtx.autoplay = true
    _animationIndex = 0;
    _animationIntervalId = -1;
    this.data.animation = ''; 
    wx.request({
      url:"https://blakeyi.cn/wx-api/query",
      data:{"id": "617e18386da017df678f0bbe"},
      dataType:"json",
      method:"POST",
      success:function(res){
          console.log(res)
          dataDesc = res.data
      },
      fail:function(err){
          console.log(err)
      }
  })
    this.startProgress()
  },
  data: {
    animation: '',
    poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    name: '此时此刻',
    author: '许巍',
    isPlay: true,
    bgImage:bgImages[0],
    curStage:1,
    curProgress:0, // 当前进度条长度
    records:[],
  },
  touchStart: function(e){
    // console.log(e.touches[0].pageX)
    let sx = e.touches[0].pageX
    let sy = e.touches[0].pageY
    this.data.touchS = [sx,sy]
  },
  touchMove: function(e){
    let sx = e.touches[0].pageX;
    let sy = e.touches[0].pageY;
    this.data.touchE = [sx, sy]
  },
  touchEnd: function(e){
    let start = this.data.touchS
    let end = this.data.touchE
    if (this.data.curStage >=2 && this.data.curStage <= 5) {
      if(start[1] < end[1] - 50){
        console.log('下滑')
        this.nextPage(true)
      }else if(start[1] > end[1] + 50){
        console.log('上滑')
        this.nextPage(false)
      }else{
        console.log('静止')
      }
    }
  },

  onShow: function () {
    _animation = wx.createAnimation({
      duration: _ANIMATION_TIME,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0'
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
    },  _ANIMATION_TIME); // 每间隔_ANIMATION_TIME进行一次旋转
  },
  stopAnimationInterval: function () {
    if (_animationIntervalId> 0) {
      clearInterval(_animationIntervalId);
      _animationIntervalId = 0;
    }
  },
  startMain() {
    console.log("startMain")
    this.nextPage(false)
  },
  nextPage(previous){
    let curStage = this.data.curStage
    console.log("curStage:", curStage)
    let records = this.data.records
    if (previous === true && curStage > 2) {
      curStage--
      this.setData({
        curStage: curStage,
        bgImage:bgImages[curStage],
        curProgress:101,
        records:records
      })
      return
    }
    curStage++
    console.log("curStage:", curStage)
    if (curStage == 2) {
      console.log(dataDesc.dateDesc.count.count)
      let monthMsg = "这是我们认识的第"+ (Math.floor(dataDesc.dateDesc.count.count/30) + 1) + "个月"
      let sumMsg = "目前已经保持"+ dataDesc.dateDesc.count.count + "天未中断"
      let page1 = [
        {
          type:"normal",
          message:"hi, 君君"
        },
        {
          type:"important",
          message:monthMsg
        },
        {
          type:"normal",
          message:"2021.12.02日第一次认识"
        },
        {
          type:"normal",
          message:sumMsg
        },
      ]
      records.push(page1)
    } else if (curStage == 3) {
      console.log(dataDesc.dateDesc.count.count)
      let avgMsg = "我们平均每天发送了"+ Math.floor(dataDesc.dateDesc.mean.count)+ "条信息"
      let maxMsg = "最多的一天发了"+ dataDesc.dateDesc.max.count + "条信息，那天是"+dataDesc.dateDesc.max.data[0]
      let minMsg = "最少的一天只发了"+ dataDesc.dateDesc.min.count + "条信息，可能那天太忙了吧"
      let page2 = [
        {
          type:"normal",
          message:avgMsg
        },
        {
          type:"important",
          message:maxMsg
        },
        {
          type:"normal",
          message:minMsg
        },
      ]
      records.push(page2)
    } else if (curStage == 4) {
      console.log(dataDesc.dateDesc.count.count)
      let avgMsg = "我们最常使用的词语是前三是："
      let key1 = Object.keys(dataDesc.wordDesc[0])[0]
      let msg1 = key1 + " 次数："+dataDesc.wordDesc[0][key1]
      let key2 = Object.keys(dataDesc.wordDesc[1])[0]
      let msg2 = key2 + " 次数："+dataDesc.wordDesc[1][key2]
      let key3 = Object.keys(dataDesc.wordDesc[2])[0]
      let msg3 = key3 + " 次数："+dataDesc.wordDesc[2][key3]
      let page3 = [
        {
          type:"normal",
          message:avgMsg
        },
        {
          type:"normal",
          message:msg1
        },
        {
          type:"important",
          message:msg2
        },
        {
          type:"normal",
          message:msg3
        },
      ]
      records.push(page3)
    }  else if (curStage == 5) {
      records.push([])
    }
    this.setData({
      curStage: curStage,
      bgImage:bgImages[curStage],
      curProgress:101,
      records:records
    })
  },
  startProgress() {
    let that = this
    setInterval(function () {
      let data = that.data.curProgress + 1
      if (data == 101) {
        //that.nextPage()
        return
      }
      that.setData({
        curProgress: data
      })
    },  1); // 每间隔_ANIMATION_TIME进行一次旋转
  }
})
