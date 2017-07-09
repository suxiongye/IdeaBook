Page({
  data: {
    id: '',
    themeName: '',
    themeLogo: ''
  },
  themeInput: function (e) {
    this.data.themeName = e.detail.value
    this.setData({
      themeName : this.data.themeName,
    })
  },
  /**
   * 选择主题图片
   */
  chooseThemeLogo: function(e){
    var page = this
    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        page.setData({
          themeLogo : res.tempFilePaths
        })
      },
    })
  },
  /**
   * 选择标签
   */
  checkboxChange: function(e){
    this.setData({
      themeTags: e.detail.value
    })
  },
  /**
   * 增加主题
   */
  addTheme: function (e) {
    this.data.id = Date.now()
    setTheme(this)
    wx.navigateBack()
  },
  /**
   * 运行时加载，如果放在onshow，会导致choossImage时重置标签
   */
  onLoad: function(){
    initTags(this)
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
  if(theme_tag.length){
    theme_tag.forEach((item)=>{
      data.push(item)
    })
  }
  if (themeTags && themeTags.length>0){
    //搜索符合条件的标签id
    var tagIdList = []
    for(var i = 0; i < themeTags.length; i++){
      for(var j = 0; j < page.data.tagList.length; j++){
        if(themeTags[i] == page.data.tagList[j].tagName){
          tagIdList.push(page.data.tagList[j].id)
        }
      }
    }
    //存储关系
    if(tagIdList.length){
      tagIdList.forEach((item)=>{
        data.push({id: Date.now(),themeId: page.data.id, tagId: item})
      })
      wx.setStorageSync("theme_tag", data)
    }
  }
}

/**
 * 初始化标签
 */
function initTags(page){
  var tags = wx.getStorageSync("tags")
  var tagList = []
  if(tags.length){
    tags.forEach((item)=>{
      tagList.push(item)
    })
  }
  page.setData({
    tagList: tagList
  })
}