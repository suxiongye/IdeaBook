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
    setThemeById(this, options.id)
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
    initTags(this)
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
  deleteTheme: function (e) {
    deleteThemeById(this.data.id)
    wx.navigateBack()
  },
  /**
   * 确认更新
   */
  editTheme: function (e) {
    setTheme(this)
    wx.navigateBack()
  },

  themeInput: function (e) {
    this.data.themeName = e.detail.value
  },
  chooseThemeLogo: function (e) {
    var page = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        page.setData({
          themeLogo: res.tempFilePaths
        })
        console.log(res.tempFilePaths)
      },
    })
  },
  /**
  * 选择标签
  */
  checkboxChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      themeTags: e.detail.value
    })
  },
})

function setThemeById(page, id) {
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
 * 增加主题函数
 */
function setTheme(page) {
  var themes = wx.getStorageSync("themes")
  var theme = page.data
  var data = [], editFlag = false
  if (themes.length) {
    themes.forEach((item) => {
      if (item.id == page.data.id) {
        item.themeLogo = page.data.themeLogo
        item.themeName = page.data.themeName
        editFlag = true
      }
      data.push(item)
    })
  }
  if (!editFlag) {
    data.push({
      id: theme.id,
      themeName: theme.themeName,
      themeLogo: theme.themeLogo
    })
  }
  wx.setStorageSync("themes", data)
  //更新主题和标签关系
  var themeTags = page.data.themeTags
  var theme_tag = wx.getStorageSync("theme_tag")
  data = []
  //存储原来的关系
  if (theme_tag.length) {
    theme_tag.forEach((item) => {
      if (item.themeId != page.data.id) {
        data.push(item)
      }
    })
  }
  if (themeTags && themeTags.length > 0) {
    //搜索符合条件的标签id
    var tagIdList = []
    for (var i = 0; i < themeTags.length; i++) {
      for (var j = 0; j < page.data.tagList.length; j++) {
        if (themeTags[i] == page.data.tagList[j].tagName) {
          tagIdList.push(page.data.tagList[j].id)
        }
      }
    }
    //存储关系
    if (tagIdList.length) {
      tagIdList.forEach((item) => {
        data.push({ id: Date.now(), themeId: page.data.id, tagId: item })
      })
    }
  }
  wx.setStorageSync("theme_tag", data)
}


/**
 * 删除主题
 */
function deleteThemeById(id) {
  var themes = wx.getStorageSync("themes")
  var theme_tag = wx.getStorageSync("theme_tag")
  var ideas = wx.getStorageSync("ideas")
  var data = []
  //删除主题元素
  if (themes.length) {
    themes.forEach((item) => {
      if (item.id != id) {
        data.push(item)
      }
    })
  }
  wx.setStorageSync('themes', data)
  //删除主题标签关系
  data = []
  if (theme_tag.length) {
    theme_tag.forEach((item) => {
      if (item.themeId != id) {
        data.push(item)
      }
    })
  }
  wx.setStorageSync("theme_tag", data)
  //删除主题相关的所有笔记
  data = []
  if (ideas.length) {
    ideas.forEach((item) => {
      if (item.themeId != id) {
        data.push(item)
      }
    })
  }
  wx.setStorageSync("ideas", data)
}

/**
 * 初始化标签
 */
function initTags(page) {
  var tags = wx.getStorageSync("tags")
  var theme_tag = wx.getStorageSync("theme_tag")
  var checkTagIdList = []
  //获取所有该主题的tagId
  for (var i = 0; i < theme_tag.length; i++) {
    if (theme_tag[i].themeId == page.data.id) {
      checkTagIdList.push(theme_tag[i].tagId)
    }
  }

  //初始化
  var tagList = []
  if (tags.length) {
    tags.forEach((item) => {
      var tagCheck = false
      for (i = 0; i < checkTagIdList.length; i++) {
        if (item.id == checkTagIdList[i]) {
          tagCheck = true
          tagList.push({
            id: item.id,
            tagColor: item.tagColor,
            tagName: item.tagName,
            checked: true
          })
        }
      }
      //如果该标签没有被选中
      if(!tagCheck){
        tagList.push({
          id: item.id,
          tagColor: item.tagColor,
          tagName: item.tagName,
          checked: false
        })
      }
    })
  }
  console.log(tagList)
  page.setData({
    tagList: tagList
  })
}