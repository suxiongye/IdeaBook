// index.js
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
      id: options.id,
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
    initIdeaById(this, this.data.id)
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

  /**
   * 更新修改信息
   */
  titleChange: function (e) {
    this.setData({
      ideaTitle: e.detail.value
    })
  },
  contentChange: function (e) {
    this.setData({
      ideaContent: e.detail.value
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
   * 更新idea
   */
  editIdea: function (e) {
    updateIdea(this)
    wx.navigateBack()
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
        if (ideaRecordList && ideaRecordList.length) {
          ideaRecordList.forEach((item) => {
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
  removeRec: function (event) {
    var data = []
    var recordList = this.data.ideaRecordList
    recordList.forEach((item) => {
      if (item != event.currentTarget.dataset.id) {
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
  play: function (event) {
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
  pause: function (event) {
    wx.pauseVoice()
    this.setData({
      playing: false
    })
  },
  /**
   * 停止
   */
  stop: function (event) {
    wx.stopVoice()
    this.setData({
      playing: false,
    })
  }
})

/**
 * 根据id获取idea
 */
function initIdeaById(page, id) {
  var ideas = wx.getStorageSync("ideas")
  if (ideas.length) {
    ideas.forEach((item) => {
      if (item.id == id) {
        page.setData({
          id: id,
          ideaTitle: item.ideaTitle,
          ideaContent: item.ideaContent,
          ideaPicList: item.ideaPicList,
          ideaRecordList: item.ideaRecordList,
          themeId: item.themeId
        })
      }
    })
  }
}

/**
 * 存储
 */
function updateIdea(page) {
  var ideas = wx.getStorageSync("ideas")
  var idea = page.data
  var data = []
  ideas.forEach((item) => {
    if (item.id == page.data.id) {
      item = { id: idea.id, ideaTitle: idea.ideaTitle, ideaContent: idea.ideaContent, ideaPicList: idea.ideaPicList, ideaRecordList: idea.ideaRecordList, themeId: idea.themeId }
    }
    data.push(item)
  })
  wx.setStorageSync("ideas", data)
}