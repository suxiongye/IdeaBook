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
    initThemeById(this, options.id)
    initIdeaList(this, options.id)
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
    initThemeById(this, this.data.id)
    initIdeaList(this, this.data.id)
    wx.setNavigationBarTitle({
      title: this.data.themeName,
    })
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
   * 解决长按事件往下传递问题
   */
  bindTouchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },
  bindTouchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },
  /**
   * 跳转到新增笔记
   */
  addIdea: function () {
    wx.navigateTo({
      url: '../../ideas/addIdea/index?id=' + this.data.id,
    })
  },
  /**
   * 跳转到笔记修改
   */
  editIdea: function (event) {
    wx.navigateTo({
      url: '../../ideas/editIdea/index?id=' + event.currentTarget.dataset.id,
    })
  },
  /**
   * 跳转到笔记详情
   */
  ideaDetail: function (event) {
    if (this.touchEndTime - this.touchStartTime < 350) {
      wx.navigateTo({
        url: '../../ideas/ideaDetail/index?id=' + event.currentTarget.dataset.id,
      })
    }
  }
})

/**
 * 根据id设置页面数据
 */
function initThemeById(page, id) {
  var themes = wx.getStorageSync("themes")
  if (themes.length) {
    themes.forEach((item) => {
      if (item.id == id) {
        page.setData({
          id: id,
          themeName: item.themeName,
          themeLogo: item.themeLogo
        })
      }
    })
  }
}

/**
 * 根据主题id获取对应ideaList
 */
function initIdeaList(page, id) {
  var ideas = wx.getStorageSync("ideas")
  var data = []
  if (ideas.length) {
    ideas.forEach((item) => {
      if (item.themeId == id) {
        data.push(item)
      }
    })
  }
  page.setData({
    ideaList: data
  })
}
