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
    initData(this)
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
   * 增加标签
   */
  addTag: function () {
    wx.navigateTo({
      url: 'addTag/index'
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
   * 编辑标签
   */
  editTag: function (event) {
    wx.navigateTo({
      url: 'editTag/index?id=' + event.currentTarget.dataset.id,
    })
  },
  /**
   * 单击标签
   */
  clickTag: function (event) {
    if (this.touchEndTime - this.touchStartTime < 350) {
      //切换标签开关状态
      var tagList = this.data.tagList
      if (tagList.length) {
        tagList.forEach((item) => {
          if (item.id == event.currentTarget.dataset.id) {
            item.open = !item.open
          } else {
            //关闭其他
            item.open = false
          }
        })
      }
      this.setData({
        tagList: tagList
      })
      console.log(tagList)
    }
  },
  /**
   *  长按删除
   */
  deleteTheme: function (event) {
    var that = this
    wx.showModal({
      title: '移除主题',
      content: '是否从该标签中移除主题',
      success: function (res) {
        if (res.confirm) {
          deleteThemeToTag(event.target.dataset.theme_id, event.target.dataset.tag_id)
          initData(that)
        } else if (res.cancel) {

        }
      }
    })
  },

  /**
   * 新增主题
   */
  addTheme: function (event) {
    addTheme(this.data.themeList[event.detail.value].id, event.currentTarget.dataset.id)
    initData(this)
  },
})

/**
 * 初始化数据
 */
function initData(page) {
  var tags = wx.getStorageSync("tags")
  var themes = wx.getStorageSync("themes")
  var data = []
  if (tags.length) {
    tags.forEach((item) => {
      data.push({
        id: item.id,
        tagName: item.tagName,
        tagColor: item.tagColor,
        open: false,
        themeList: getThemeListByTagId(item.id)
      })
    })
  }
  page.setData({
    tagList: data,
  })
  data = []
  if (themes.length) {
    themes.forEach((item) => {
      data.push({
        id: item.id,
        themeName: item.themeName
      })
    })
  }
  page.setData({
    themeList: data,
  })
  console.log(data)
}
/**
 * 根据tagId获取主题列表
 */
function getThemeListByTagId(id) {
  var themes = wx.getStorageSync("themes")
  var theme_tag = wx.getStorageSync("theme_tag")
  var themeList = []
  if (themes.length && theme_tag.length) {
    themes.forEach((item) => {
      for (var i = 0; i < theme_tag.length; i++) {
        if (theme_tag[i].tagId == id && theme_tag[i].themeId == item.id) {
          themeList.push(item)
        }
      }
    })
  }
  return themeList;
}

/**
 * 删除主题与标签联系
 */
function deleteThemeToTag(themeId, tagId) {
  var theme_tag = wx.getStorageSync("theme_tag")
  var data = []
  theme_tag.forEach((item) => {
    if (themeId == item.themeId && tagId == item.tagId) {
    } else {
      data.push(item)
    }
  })
  wx.setStorageSync("theme_tag", data)
}

/**
 * 增加主题联系
 */
function addTheme(themeId, tagId) {
  var theme_tag = wx.getStorageSync("theme_tag")
  var data = []
  var exist = false
  if (theme_tag.length) {
    theme_tag.forEach((item) => {
      if (themeId == item.themeId && tagId == item.tagId) {
        exist = true
      }
      data.push(item)
    })
  }
  if (exist == false) {
    data.push({
      id: Date.now(),
      themeId: themeId,
      tagId: tagId
    })
  }
  wx.setStorageSync("theme_tag", data)
}
