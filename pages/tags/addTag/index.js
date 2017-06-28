// pages/tags/addTag/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    colorList: ['AliceBlue','AntiqueWhite'],
    selectedColor: 0,
    tag:{
      tagColor: 'AliceBlue',
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
  tagInput: function(e){
    this.setData({
      tag:{
        tagName: e.detail.value,
        tagColor: this.data.colorList[this.data.selectedColor]
      }
    })
  },
  /**
   * 设置选择标签的颜色
   */
  colorPickerChange: function(e){
    this.setData({
      selectedColor: e.detail.value,
      tag: {
        id: this.data.tag.id,
        tagName: this.data.tag.tagName,
        tagColor: this.data.colorList[e.detail.value]
      }
    })
  },
  addTag: function(e){
    this.data.tag.id = Date.now()
    setTag(this)
    wx.navigateBack()
  }
})

/**
 * 存储标签
 */
function setTag(page){
  var tags = wx.getStorageSync("tags")
  var data = [], editTag = false
  if(tags.length){
    tags.forEach((item)=>{
      if(item.id == page.data.tag.id){
        item.tagName = page.data.tag.tagName
        item.tagColor = page.data.tag.tagColor
        editTag = true
      }
      data.push(item)
    })
  }
  if(!editTag){
    data.push(page.data.tag)
  }
  wx.setStorageSync("tags", data)
}