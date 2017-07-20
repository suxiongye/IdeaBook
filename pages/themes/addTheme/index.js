Page({
  data: {
    id: '',
    themeName: '',
    themeLogo: '',
    disabled: true
  },
  themeInput: function (e) {
    this.data.themeName = e.detail.value
    this.setData({
      themeName: this.data.themeName,
    })
    isLegal(this)
  },
  /**
   * 选择主题图片
   */
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
        isLegal(page)
      },
    })
  },
  /**
   * 选择标签
   */
  checkboxChange: function (e) {
    this.setData({
      themeTags: e.detail.value
    })
  },
  /**
   * 增加主题
   */
  addTheme: function (e) {
    if (!isLegal(this)) {
      return
    }
    this.data.id = Date.now()
    setTheme(this)
    wx.navigateBack()
  },
  /**
   * 运行时加载，如果放在onshow，会导致choossImage时重置标签
   */
  onLoad: function () {
    initTags(this)
  },
  /**
   * 表格重置
   */
  formReset: function () {
    this.setData({
      id: '',
      themeName: '',
      themeLogo: ''
    })
    isLegal(this)
  },
  /**
   * 预览图片
   */
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.themeLogo
    })
  }
})

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
  //增加主题和标签关系
  var themeTags = page.data.themeTags
  var theme_tag = wx.getStorageSync("theme_tag")
  data = []
  //存储原来的关系
  if (theme_tag.length) {
    theme_tag.forEach((item) => {
      data.push(item)
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
      wx.setStorageSync("theme_tag", data)
    }
  }
}

/**
 * 初始化标签
 */
function initTags(page) {
  var tags = wx.getStorageSync("tags")
  var tagList = []
  if (tags.length) {
    tags.forEach((item) => {
      tagList.push(item)
    })
  }
  page.setData({
    tagList: tagList
  })
}

/**
 * 判断增加主题是否符合要求
 */
function isLegal(page) {
  var themeName = page.data.themeName
  var themeLogo = page.data.themeLogo
  //判断字段是否合法
  if (!themeName) {
    page.setData({
      themeNameError: '',
      disabled: true
    })
    return false;
  }
  //判断名称是否重复
  var themes = wx.getStorageSync("themes")
  var conflict = false;
  if (themes.length) {
    themes.forEach((item) => {
      if (item.themeName == themeName) {
        conflict = true;
      }
    })
  }
  if (conflict == true) {
    page.setData({
      themeNameError: '该主题已存在',
      disabled: true
    })
    return false;
  }
  //判断图片是否存在
  if (!themeLogo) {
    page.setData({
      themeNameError: '',
      disabled: true
    })
    return false
  }
  page.setData({
    themeNameError: '',
    disabled: false
  })
  return true;
}