const util = require('../../utils/util.js')

const TASK_ADD = 1
const TASK_MOD = 2
wx.cloud.init({
  env: 'blakeyi-3gkzlc1w8392c037'
})
//获取数据库环境引用
const db = wx.cloud.database({
  env: 'blakeyi-3gkzlc1w8392c037'
})
const periodID = 'tUaPcDxzJy8ajjbdboMAvT0A1mHm_dXLDdFjoeFUB-w'
const lunchID = 'rFl_n3k-rdZ1loFMS-MAdCbAunCnW7T1JkF4fiha2Ik'
const periodMsg = {
  "date1": {
    "value": '2022年02月25日'
  },
  "number2": {
    "value": '13'
  },
  "thing3": {
    "value": '记得别碰冷水,保护好自己哟'
  }
}
const lunchMsg = {
  "thing1": {
    "value": '中午点外卖'
  },
  "time2": {
    "value": '11:30'
  },
  "thing4": {
    "value": '卫东龙商务大厦'
  }
}

Page({
  data: {
    searchStr: '', // 搜索输入字符串
    taskStatus: 0,
    periodTypeOption: ["每天", "工作日", "自定义"],
    periodType: "",
    periodIndex: 0,
    concreteTime: '12:00',
    dateSelectShow: false, // 选择星期几
    title: "",
    desc: "",
    tag: "提醒",
    tagCheckStatus: true,
    curId: 0, // 记录修改时的下标
    tasks: null,
    checkboxItems: [{
        name: '星期一',
        value: 0,
        checked: false
      },
      {
        name: '星期二',
        value: 1,
        checked: false
      },
      {
        name: '星期三',
        value: 2,
        checked: false
      },
      {
        name: '星期四',
        value: 3,
        checked: false
      },
      {
        name: '星期五',
        value: 4,
        checked: false
      },
      {
        name: '星期六',
        value: 5,
        checked: false
      },
      {
        name: '星期日',
        value: 6,
        checked: false
      },
    ],
    checkboxItemValue: []
  },
  onLoad(){
    this.getOpenId()
    var that = this
    db.collection('tasks').get({
      success: function(res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        console.log(res)
        that.setData({
          tasks:res.data
        })
      }
    })
  },
  onShow() {
    let date = util.formatTime(new Date())
    let day = date.split(' ')[0]
    let hour = date.split(' ')[1]
    console.log(day)
    console.log(hour)
  },
  onTabItemTap(item) {
    console.log(item.index) // tabbar索引
    console.log(item.pagePath) // tabbar路径
    console.log(item.text) // tabbar文字
    wx.requestSubscribeMessage({
      tmplIds: [periodID, lunchID],
      success(res) {
        console.log(res)
      }
    })
  },
  onChange(e) {
    this.setData({
      searchStr: e.detail,
    });
  },
  onSearch() {
    Toast('搜索' + this.data.searchStr);
  },
  onClick() {
    Toast('搜索' + this.data.searchStr);
  },
  onPeriodChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  },

  bindPeriodChange(e) {
    let ret = e.detail.value
    console.log(ret)
    if (ret == 2) {
      console.log(11111)
      this.setData({
        dateSelectShow: true
      })
    }
    this.setData({
      periodType: this.data.periodTypeOption[e.detail.value]
    })
  },
  bindTimeChange(e) {
    this.setData({
      concreteTime: e.detail.value
    })
  },
  checkboxChange(e) {
    this.setData({
      checkboxItemValue: e.detail.value
    })
  },
  dateSelectclose(e) {
    console.log(this.data.checkboxItemValue)
    let sets = []
    let ret = "星期"
    for (let i in this.data.checkboxItemValue) {
      sets.push(parseInt(i))
    }
    console.log(sets)
    sets.sort()
    for (let i in sets) {
      ret += this.data.checkboxItems[i].name.substr(2, 1) + ","
    }
    console.log(ret)
    ret = ret.substr(0, ret.length - 1)
    this.setData({
      periodType: ret
    })
  },
  getOpenId() {
    let openid = wx.getStorageSync('openid')
    console.log(openid)
    if (openid != "") {
      return openid
    }
    wx.cloud.callFunction({
      name: 'getOpenId',
      data: {
        message: 'getOpenId',
      }
    }).then(res => {
      console.log(res)
      wx.setStorage({
        key: "openid",
        data: res.result.openid
      })
    })
  },
  async weSubmitForm() {
    console.log(this.data)
    let taskStatus = this.data.taskStatus
    this.setData({
      taskStatus: 0
    })
    let tasks = this.data.tasks
    if (taskStatus == TASK_MOD) {
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == this.data.curId) {
          console.log()
          tasks[i] = {
            "tag": this.data.tag,
            "title": this.data.title,
            "desc": this.data.desc,
            "period": this.data.periodType,
            "id": this.data.curId,
            "time":this.data.concreteTime
          }
          await db.collection('tasks').where({
            id:this.data.curId
          }).update({data:tasks[i]}).then(res => {
            console.log(res)  
          })
        }
      }
    } else {
      let task = {
        "tag": this.data.tag,
        "title": this.data.title,
        "desc": this.data.desc,
        "period": this.data.periodType,
        "id": this.getUuiD()
      }
      db.collection('tasks').add({data:task})
      tasks.push(task)
    }

    // if (this.data.title == "经期") {
    //   this.sendMsg(periodID, periodMsg)
    // } else {
    //   this.sendMsg(lunchID, lunchMsg)
    // }
    console.log(tasks)
    this.setData({
      tasks: tasks
    })
    
  },
  sendMsg(templateId, content) {
    //做一些后续操作，不用考虑代码的异步执行问题。
    wx.cloud.callFunction({
      name: "sendMsg",
      data: {
        openid: this.getOpenId(),
        templateId: templateId,
        content: content,
      }
    }).then(res => {
      console.log(res)
    })
  },
  showTask() {
    this.setData({
      taskStatus: TASK_ADD
    })
  },
  restForm() {
    this.setData({
      taskStatus: 0
    })
  },
  bindTagChange(e) {
    console.log(e)
    this.setData({
      tag: e.detail.value
    })
  },
  // 生成一个8位不重复的id
  getUuiD() {
    return Number(Math.random().toString().substr(2, 8) + Date.now()).toString(36)
  },
  deleteTask(e) {
    console.log(e.currentTarget.dataset.task)
    let id = e.currentTarget.dataset.task.id
    db.collection('tasks').where({id:id}).remove()
    let tasks = this.data.tasks.filter(item => {
      if (item.id == id) {
        return false
      }
      return true
    })
    console.log(tasks)
    this.setData({
      tasks: tasks
    })
  },

  editTask(e) {
    let task = e.currentTarget.dataset.task
    let tagCheckStatus = true
    if (task.tag == "任务") {
      tagCheckStatus = false
    }
    this.setData({
      taskStatus: TASK_MOD,
      title: task.title,
      periodType: task.period,
      desc: task.desc,
      curId: task.id,
      tag: task.tag,
      tagCheckStatus: tagCheckStatus
    })
  }

});