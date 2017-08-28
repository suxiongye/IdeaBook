// pages/ideas/ideaDetail/index.js
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
    initIdea(this)
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
   * 修改idea
   */
  editIdea: function () {
    wx.navigateTo({
      url: '../editIdea/index?id=' + this.data.id,
    })
  },
  deleteIdea: function (event) {
    deleteIdeaById(this.data.id)
    wx.navigateBack()
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
  },
  /**
* 解决长按事件往下传递问题
*/
  bindTouchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },
  bindTouchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },
  /**
* 预览图片
*/
  previewImage: function (e) {
    if (this.touchEndTime - this.touchStartTime < 350) {
      var current = e.target.dataset.src
      wx.previewImage({
        current: current,
        urls: this.data.ideaPicList
      })
    }
  },
})

/**
 * 初始化idea详情
 */
function initIdea(page) {
  var ideas = wx.getStorageSync("ideas")
  var themes = wx.getStorageSync("themes")

  if (ideas.length) {
    ideas.forEach((item) => {
      if (item.id == page.data.id) {
        page.setData({
          ideaTitle: item.ideaTitle,
          ideaContent: item.ideaContent,
          ideaPicList: item.ideaPicList,
          ideaRecordList: item.ideaRecordList,
          themeId: item.themeId
        })
        wx.setNavigationBarTitle({
          title: page.data.ideaTitle,
        })
      }
    })
    //寻找所属主题名称
    if (themes.length) {
      themes.forEach((item) => {
        if (item.id == page.data.themeId) {
          page.setData({
            themeName: item.themeName
          })
        }
      })
    }
  }
}

/**
 * 删除idea
 */
function deleteIdeaById(id) {
  var ideas = wx.getStorageSync("ideas")
  var data = []
  if (ideas.length) {
    ideas.forEach((item) => {
      if (item.id != id) {
        data.push(item)
      }
    })
  }
  wx.setStorageSync("ideas", data)
}