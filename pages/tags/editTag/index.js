Page({
  /**
   * 页面的初始数据
   */
  data: {
    colorList: ['Blue', 'DarkOrange'],
    selectedColor: 0,
    btnDisabled: true,
    tag: {
      tagColor: 'Blue',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    initTag(this, options.id)
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
  deleteTag: function (e) {
    var page = this
    wx.showModal({
      title: '删除标签',
      content: '删除标签后不可恢复，是否确认删除',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '',
      confirmText: '确定',
      confirmColor: '',
      success: function (res) {
        if (res.confirm) {
          deleteTagById(page.data.tag.id)
          wx.navigateBack()
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 设置标签名称
   */
  tagInput: function (e) {
    var tagNameError = ""
    var btnDisabled = false
    if (!e.detail.value || e.detail.value == "") {
      tagNameError = "标签名称不为空"
      btnDisabled = true
    }
    else {
      if (isTagNameConflict(this.data.oldTagName, e.detail.value)) {
        tagNameError = "标签已存在"
        btnDisabled = true
      }
    }
    this.setData({
      tagNameError: tagNameError,
      btnDisabled: btnDisabled,
      tag: {
        id: this.data.tag.id,
        tagName: e.detail.value,
        tagColor: this.data.colorList[this.data.selectedColor]
      }
    })
  },
  /**
   * 设置选择标签的颜色
   */
  colorPickerChange: function (e) {
    this.setData({
      selectedColor: e.detail.value,
      tag: {
        id: this.data.tag.id,
        tagName: this.data.tag.tagName,
        tagColor: this.data.colorList[e.detail.value]
      }
    })
  },
  editTag: function (e) {
    setTag(this)
    wx.navigateBack()
  }
})
/**
 * 根据id初始化标签
 */
function initTag(page, id) {
  var tags = wx.getStorageSync("tags")
  if (tags.length) {
    tags.forEach((item) => {
      if (item.id == id) {
        console.log(item.tagName)
        var selectedColor
        for (var i = 0; i < page.data.colorList.length; i++) {
          if (item.tagColor == page.data.colorList[i]) {
            selectedColor = i
          }
        }
        console.log(item.id)
        page.setData({
          selectedColor: selectedColor,
          oldTagName: item.tagName,
          tag: {
            tagName: item.tagName,
            tagColor: item.tagColor,
            id: item.id
          }
        })
      }
    })
  }
}

/**
 * 存储标签
 */
function setTag(page) {
  var tags = wx.getStorageSync("tags")
  var data = [], editTag = false
  if (tags.length) {
    tags.forEach((item) => {
      if (item.id == page.data.tag.id) {
        item.tagName = page.data.tag.tagName
        item.tagColor = page.data.tag.tagColor
        editTag = true
      }
      data.push(item)
    })
  }
  if (!editTag) {
    data.push(page.data.tag)
  }
  wx.setStorageSync("tags", data)
}

/**
 * 删除标签
 */
function deleteTagById(id) {
  var tags = wx.getStorageSync("tags")
  var data = []
  if (tags.length) {
    tags.forEach((item) => {
      if (item.id != id) {
        data.push(item)
      }
    })
  }
  wx.setStorageSync("tags", data)
  //删除主题标签关系
  var theme_tag = wx.getStorageSync("theme_tag")
  data = []
  if (theme_tag.length) {
    theme_tag.forEach((item) => {
      if (item.tagId != id) {
        data.push(item)
      }
    })
  }
  wx.setStorageSync("theme_tag", data)
}

/**
 * 判断是否重名
 */
function isTagNameConflict(oldName, newName) {
  var conflict = false
  if (oldName == newName) return conflict
  var tags = wx.getStorageSync("tags")
  if (tags.length) {
    tags.forEach((item) => {
      if (item.tagName == newName) {
        conflict = true;
        return conflict
      }
    })
  }
  return conflict
}