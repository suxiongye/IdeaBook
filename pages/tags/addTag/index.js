// pages/tags/addTag/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    colorList: ['Blue', 'DarkOrange'],
    selectedColor: 0,
    btnDisabled: true,
    tag: {
      tagName: "",
    }
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
   * 设置标签名称
   */
  tagInput: function (e) {
    this.data.tag.tagName = e.detail.value
    var page = this
    if (isTagNameLegal(this)) {
      this.setData({
        btnDisabled: false,
        tag: {
          tagName: e.detail.value,
          tagColor: page.data.colorList[page.data.selectedColor]
        }
      })
    } else {
      this.setData({
        btnDisabled: true
      })
      console.log("su")
    }
    console.log(this.data.btnDisabled)
  },
  /**
   * 设置选择标签的颜色
   */
  colorPickerChange: function (e) {
    var page = this
    this.setData({
      selectedColor: e.detail.value,
      tag: {
        id: page.data.tag.id,
        tagName: page.data.tag.tagName,
        tagColor: page.data.colorList[e.detail.value]
      }
    })
  },
  addTag: function (e) {
    setTag(this)
    wx.navigateBack()
  },
  formReset: function (e) {
    this.setData({
      colorList: ['Blue', 'DarkOrange'],
      selectedColor: 0,
      btnDisabled: true,
      tagNameError: "",
      tag: {
        tagName: "",
      }
    })
  }
})

/**
 * 存储标签
 */
function setTag(page) {
  var tags = wx.getStorageSync("tags")
  var data = []
  if (tags.length) {
    tags.forEach((item) => {
      //重复则返回
      if (item.id == page.data.tag.id) {
        return;
      }
      data.push(item)
    })
  }
  data.push({
    id: Date.now(),
    tagName: page.data.tag.tagName,
    tagColor: page.data.tag.tagColor
  })
  wx.setStorageSync("tags", data)
}
/**
 * 检测是否合法
 */
function isTagNameLegal(page) {
  var tags = wx.getStorageSync("tags")
  var tagName = page.data.tag.tagName;
  var conflict = false
  if (!tagName) {
    page.setData({
      tagNameError: "标签名称不能为空",
      btnDisabled: true
    })
    return false;
  }
  if (tags.length) {
    tags.forEach((item) => {
      if (item.tagName == tagName) {
        page.setData({ tagNameError: "标签已存在", btnDisabled: true })
        conflict = true
      }
    })
  }
  if (conflict) {
    return false
  }
  page.setData({
    tagNameError: "",
    btnDisabled: false
  })
  return true;
}