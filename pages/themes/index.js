Page({
  data: {
  },
  addTheme: function () {
    wx.navigateTo({
      url: 'addTheme/index'
    })
  },
  onLoad: function () {
    initData(this)
  },
  onShow: function () {
    initData(this)
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
   * 跳转到主题列表
   */
  themeDetail: function (event) {
    if (this.touchEndTime - this.touchStartTime < 350) {
      wx.navigateTo({
        url: 'themeDetail/index?id=' + event.currentTarget.dataset.id,
      })
    }
  },
  /**
   * 跳转到修改主题
   */
  editTheme: function (event) {
    wx.navigateTo({
      url: 'editTheme/index?id=' + event.currentTarget.dataset.id,
    })
  },
  
  /**
   * 点击标签事件
   */
  clickTag: function(event){
    this.setData({
      selectedTag: event.currentTarget.dataset.id
    })
    initThemeByTag(this)
  }
})

/**
 * 初始化所有标签和主题
 */
function initData(page) {
  var themes = wx.getStorageSync("themes")
  var allTag = { tagName: "所有标签" }
  var noTag = { tagName: "无标签" }
  var tagList = []
  tagList.push(allTag)
  var tags = wx.getStorageSync("tags")
  if (tags.length) {
    tags.forEach((item) => {
      tagList.push(item)
    })
  }
  tagList.push(noTag)
  page.setData({
    themeList: themes,
    tagList: tagList,
    selectedTag: 0
  })
}

/**
 * 根据选择的标签筛选主题
 */
function initThemeByTag(page) {
  //如果选择的是所有标签
  if (page.data.selectedTag == 0) {
    initData(page)
  }
  //如果选择的是无标签
  else if (page.data.selectedTag == page.data.tagList.length - 1) {
    initNoTagTheme(page)
  }
  //如果选择其他
  else {
    initTagTheme(page)
  }
}

/**
 * 寻找没有标签的主题
 */
function initNoTagTheme(page) {
  var themes = wx.getStorageSync("themes")
  var theme_tag = wx.getStorageSync("theme_tag")
  var data = [], tagFlag = false
  for (var i = 0; i < themes.length; i++) {
    tagFlag = false
    for (var j = 0; j < theme_tag.length; j++) {
      if (themes[i].id == theme_tag[j].themeId) {
        tagFlag = true
      }
    }
    if (!tagFlag) {
      data.push(themes[i])
    }
  }
  page.setData({
    themeList: data
  })
}

/**
 * 寻找特定标签主题
 */
function initTagTheme(page) {
  var themes = wx.getStorageSync("themes")
  var theme_tag = wx.getStorageSync("theme_tag")
  var tags = wx.getStorageSync("tags")
  //找到选择的tag的id
  var tagId = page.data.tagList[page.data.selectedTag].id
  //获取符合条件的主题id
  var themesIdList = []
  if (themes.length && theme_tag.length) {
    for (var i = 0; i < themes.length; i++) {
      theme_tag.forEach((item) => {
        if (item.tagId == tagId && item.themeId == themes[i].id) {
          themesIdList.push(item.themeId)
        }
      })
    }
  }
  //获取符合条件的主题元素
  var data = []
  if (themes.length) {
    themes.forEach((item) => {
      for (var i = 0; i < themesIdList.length; i++) {
        if (item.id == themesIdList[i]) {
          data.push(item)
        }
      }
    })
  }
  page.setData({
    themeList: data
  })
}