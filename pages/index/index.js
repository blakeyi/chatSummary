// index.js
// 获取应用实例
const app = getApp()
var _animation; // 动画实体
var _animationIndex = 0; // 动画执行次数index（当前执行了多少次）
var _animationIntervalId = -1; // 动画定时任务id，通过setInterval来达到无限旋转，记录id，用于结束定时任务
const _ANIMATION_TIME = 500; // 动画播放一次的时长ms
const bgImages = [
  "../imgs/progress.jpg",
  "../imgs/background.jpg",
  "../imgs/main.jpg",
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
    src: '../imgs/奇妙之旅-抖音.mp3',
    isPlay: true,
    bgImage:bgImages[0],
    curStage:0,
    curProgress:0, // 当前进度条长度
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
