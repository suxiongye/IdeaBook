// pages/ideas/addIdea/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      themeId: options.id,
      recording: false,
      playing: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  titleChange: function (event) {
    this.setData({
      ideaTitle: event.detail.value
    })
  },
  contentChange: function (event) {
    this.setData({
      ideaContent: event.detail.value
    })
  },
  /**
   * 增加图片
   */
  choosePic: function (e) {
    var page = this
    //存储原来的图片
    var picList = page.data.ideaPicList
    var data = []
    if (picList && picList.length) {
      picList.forEach((item) => {
        data.push(item)
      })
    }
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        if (res.tempFilePaths && res.tempFilePaths.length) {
          res.tempFilePaths.forEach((item) => {
            data.push(item)
          })
        }
        page.setData({
          ideaPicList: data
        })
        console.log(res.tempFilePaths)
      },
    })
  },
  /**
  * 根据下标删除图片
  */
  removePic: function (event) {
    console.log(event.currentTarget.dataset.index)
    var index = event.currentTarget.dataset.index
    var data = []
    for (var i = 0; i < this.data.ideaPicList.length; i++) {
      if (i != index) {
        data.push(this.data.ideaPicList[i])
      }
    }
    this.setData({
      ideaPicList: data
    })
  },

  /**
   * 开始录音
   */
  startRecord: function () {
    var that = this
    var ideaRecordList = this.data.ideaRecordList
    var data = []
    this.setData({ recording: true })
    wx.startRecord({
      success: function (res) {
        if(ideaRecordList && ideaRecordList.length){
          ideaRecordList.forEach((item)=>{
            data.push(item)
          })
        }
        data.push(res.tempFilePath)
        that.setData({
          ideaRecordList: data,
        })
      },
      complete: function () {
        that.setData({ recording: false })
      },
      fail: function (res) {
        //录音失败
        console.log("fail record")
      }
    })
  },
  /**
   * 停止录音
   */
  stopRecord: function () {
    wx.stopRecord()
  },
  /**
   * 移除录音
   */
  removeRec: function(event){
    var data = []
    var recordList = this.data.ideaRecordList
    recordList.forEach((item)=>{
      if(item != event.currentTarget.dataset.id){
        data.push(item)
      }
    })
    this.setData({
      ideaRecordList: data
    })
  },
  /**
   * 播放
   */
  play: function(event){
    var that = this
    this.setData({
      playing: true
    })
    wx.playVoice({
      filePath: event.currentTarget.dataset.id,
      success: function () {
        that.setData({
          playing: false,
        })
      }
    })
  },
  /**
   * 暂停
   */
  pause: function(event){
    wx.pauseVoice()
    this.setData({
      playing: false
    })
  },
  /**
   * 停止
   */
  stop: function(event){
    wx.stopVoice()
    this.setData({
      playing: false,
    })
  },
  /**
   * 添加idea
   */
  addIdea: function () {
    this.setData({
      id: Date.now()
    })
    setIdea(this)
    wx.navigateBack()
  }
})

/**
 * 存储
 */
function setIdea(page) {
  var ideas = wx.getStorageSync("ideas")
  var idea = page.data
  var data = []
  if (ideas.length) {
    ideas.forEach((item) => {
      data.push(item)
    })
  }
  idea = { id: idea.id, ideaTitle: idea.ideaTitle, ideaContent: idea.ideaContent, ideaPicList: idea.ideaPicList, ideaRecordList: idea.ideaRecordList, themeId: idea.themeId }
  data.push(idea)
  wx.setStorageSync("ideas", data)
}