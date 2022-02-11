
Page({
  data: {
    searchStr: '', // 搜索输入字符串
    addTaskShow:false,
    periodTypeOption: ["每天","工作日","自定义"],
    periodType:"",
    periodIndex:0,
    concreteTime: '12:00',
    dateSelectShow:false, // 选择星期几
    title:"",
    desc:"",
    tag:"",
    tagCheckStatus:true,
    tasks: [{ "tag": "提醒", "title": "blakeyi", "desc": "blakeyi", "period": "111", "index":0 },
    { "tag": "提醒", "title": "blakeyi", "desc": "blakeyi", "period": "111", "index":1 }],
    checkboxItems: [
      {name: '星期一', value: 0, checked:false},
      {name: '星期二', value: 1, checked:false},
      {name: '星期三', value: 2, checked:false},
      {name: '星期四', value: 3, checked:false},
      {name: '星期五', value: 4, checked:false},
      {name: '星期六', value: 5, checked:false},
      {name: '星期日', value: 6, checked:false},
  ],
  checkboxItemValue:[]
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
    const { picker, value, index } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  },
  showTask(){
    this.setData({
      addTaskShow:true
    })
  },
  bindPeriodChange(e){
    let ret = e.detail.value
    console.log(ret)
    if (ret == 2) {
      console.log(11111)
      this.setData({
        dateSelectShow:true
      })
    } 
    this.setData({
      periodType: this.data.periodTypeOption[e.detail.value]
    })
  },
  bindTimeChange(e){
    this.setData({
      concreteTime: e.detail.value
    })
  },
  checkboxChange(e){
    this.setData({
      checkboxItemValue:e.detail.value
    })
  },
  dateSelectclose(e){
    console.log(this.data.checkboxItemValue)
    let sets = []
    let ret = "星期"
    for(let i in this.data.checkboxItemValue) {
      sets.push(parseInt(i))
    }
    console.log(sets)
    sets.sort()
    for (let i in sets) {
      ret += this.data.checkboxItems[i].name.substr(2, 1) + ","
    }
    console.log(ret)
    ret = ret.substr(0, ret.length-1)
    this.setData({
      periodType:ret
    })
  },
  weSubmitForm(){
    console.log(this.data)
    this.setData({
      addTaskShow:false
    })
    let tasks = this.data.tasks
    let task = { "tag": this.data.tag, "title": this.data.title, "desc": this.data.desc, "period": this.data.periodType, "index": tasks.length}
    tasks.push(task)
    this.setData({
      tasks:tasks
    })
  },
  restForm(){
    this.setData({
      addTaskShow:false
    })
  },
  bindTagChange(e){
    console.log(e)
    this.setData({
      tag:e.detail.value
    })
  },
  deleteTask(e){
    console.log(e.currentTarget.dataset.task)
    let index = e.currentTarget.dataset.task.index
    let tasks = this.data.tasks.filter(item => {
      if (item.index == index) {
        return false
      }
      return true
    })
    console.log(tasks)
    this.setData({
      tasks:tasks
    })
  },
  editTask(e){
    let task =  e.currentTarget.dataset.task
    let tagCheckStatus = true
    if (task.tag == "提醒") {
      tagCheckStatus = false
    }
    this.setData({
      addTaskShow:true,
      title:task.title,
      periodType:task.period,
      desc:task.desc,
      index:task.index,
      tag:task.tag,
      tagCheckStatus:tagCheckStatus
    })
  }

});