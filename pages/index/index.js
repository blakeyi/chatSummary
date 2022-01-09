// index.js
// 获取应用实例
const app = getApp()
var _animation; // 动画实体
var _animationIndex = 0; // 动画执行次数index（当前执行了多少次）
var _animationIntervalId = -1; // 动画定时任务id，通过setInterval来达到无限旋转，记录id，用于结束定时任务
const _ANIMATION_TIME = 500; // 动画播放一次的时长ms
const bgImages = [
  "../images/progress.jpg",
  "../images/background.jpg",
  "../images/main.jpg",
  "../images/main1.jpg",
]

Page({
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
    _animationIndex = 0;
    _animationIntervalId = -1;
    this.data.animation = ''; 
    this.startProgress()
  },
  data: {
    animation: '',
    poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    name: '此时此刻',
    author: '许巍',
    src: '../music/奇妙之旅-抖音.mp3',
    isPlay: true,
    bgImage:bgImages[0],
    curStage:2,
    curProgress:0, // 当前进度条长度
    records:[
      [
        {
          type:"normal",
          message:"hi, 君君"
        },
        {
          type:"important",
          message:"这是我们认识的第一个月"
        },
        {
          type:"normal",
          message:"2021.12.02日第一次认识"
        },
        {
          type:"normal",
          message:"目前已经保持40天未中断"
        },
      ],
      [
        {
          type:"normal",
          message:"2021.12.26日晚上"
        },
        {
          type:"important",
          message:"我们一起度过了第一圣诞节"
        },
        {
          type:"normal",
          message:"这天我很开心"
        },
      ],
    ],
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
    console.log(start)
    console.log(end)
    if (this.data.curStage >=2 && this.data.curStage < 4) {
      if(start[1] < end[1] - 50){
        console.log('下滑')
        this.data.curStage--
        this.setData({
          bgImage:bgImages[this.data.curStage],
          curStage:this.data.curStage
        })
      }else if(start[1] > end[1] + 50){
        console.log('上滑')
        this.data.curStage++
        this.setData({
          bgImage:bgImages[this.data.curStage],
          curStage:this.data.curStage
        })
      }else{
        console.log('静止')
      }
    }
  },
  audioPlay: function () {
    if (this.data.isPlay) {
      this.audioCtx.pause()
      this.stopAnimationInterval()
      this.setData({
        bgImage:bgImages[++this.data.curStage]
      })
    } else {
      this.audioCtx.play()
      this.startAnimationInterval()
    }
    this.setData({
      isPlay:!this.data.isPlay
    })
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
    console.log(111)
    this.setData({
      curStage: 2,
      bgImage:bgImages[2]
    })
    console.log(this.data)
  },
  startProgress() {
    let that = this
    setInterval(function () {
      let data = that.data.curProgress + 1
      if (data == 101) {
        that.setData({
          curStage: 1,
          bgImage:bgImages[1],
          curProgress:101
        })
        //that.startAnimationInterval()
        that.audioCtx.play()
        return
      }
      that.setData({
        curProgress: data
      })
    },  1); // 每间隔_ANIMATION_TIME进行一次旋转
  }
})
